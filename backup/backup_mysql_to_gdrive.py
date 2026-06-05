import base64
import gzip
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from google.oauth2 import service_account
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload


DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.file"]


def get_env(name: str, default: str | None = None, required: bool = False) -> str:
    value = os.getenv(name, default)
    if required and not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value or ""


def is_enabled() -> bool:
    return get_env("BACKUP_ENABLED", "false").strip().lower() in {"1", "true", "yes", "on"}


def now_stamp() -> str:
    return datetime.now().strftime("%Y%m%d-%H%M%S")


def utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def run_mysql_dump(output_path: Path) -> None:
    host = get_env("DB_HOST", "db")
    port = get_env("DB_PORT", "3306")
    name = get_env("DB_NAME", required=True)
    user = get_env("DB_USER", required=True)
    password = get_env("DB_PASSWORD", required=True)

    cmd = [
        "mysqldump",
        "--single-transaction",
        "--quick",
        "--routines",
        "--triggers",
        "--events",
        "-h",
        host,
        "-P",
        port,
        "-u",
        user,
        name,
    ]

    print(f"[db-backup] dumping MySQL database '{name}' from {host}:{port}")
    process_env = os.environ.copy()
    process_env["MYSQL_PWD"] = password
    with subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=process_env,
    ) as process:
        assert process.stdout is not None
        assert process.stderr is not None
        with output_path.open("wb") as raw_file:
            with gzip.GzipFile(fileobj=raw_file, mode="wb", compresslevel=6) as gz_file:
                shutil.copyfileobj(process.stdout, gz_file)

        stderr = process.stderr.read()
        return_code = process.wait()
        if return_code != 0:
            raise RuntimeError(stderr.decode("utf-8", errors="replace"))


def load_service_account_credentials():
    raw_json = get_env("GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON", "")
    raw_b64 = get_env("GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64", "")

    if raw_b64:
        raw_json = base64.b64decode(raw_b64).decode("utf-8")

    if raw_json:
        info = json.loads(raw_json)
        return service_account.Credentials.from_service_account_info(info, scopes=DRIVE_SCOPES)

    return None


def load_oauth_credentials():
    client_id = get_env("GOOGLE_DRIVE_OAUTH_CLIENT_ID", "")
    client_secret = get_env("GOOGLE_DRIVE_OAUTH_CLIENT_SECRET", "")
    refresh_token = get_env("GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN", "")

    if not (client_id and client_secret and refresh_token):
        return None

    credentials = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=DRIVE_SCOPES,
    )
    credentials.refresh(Request())
    return credentials


def drive_service():
    credentials = load_service_account_credentials() or load_oauth_credentials()
    if not credentials:
        raise RuntimeError(
            "Google Drive credentials are not configured. Set OAuth refresh-token env vars "
            "or GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64."
        )

    return build("drive", "v3", credentials=credentials, cache_discovery=False)


def upload_backup(service, file_path: Path) -> str:
    folder_id = get_env("GOOGLE_DRIVE_FOLDER_ID", "")
    metadata: dict[str, object] = {
        "name": file_path.name,
        "description": f"Automated MySQL backup created at {utc_iso()}",
        "appProperties": {"source": "tmhstore-db-backup"},
    }
    if folder_id:
        metadata["parents"] = [folder_id]

    media = MediaFileUpload(str(file_path), mimetype="application/gzip", resumable=True)
    print(f"[db-backup] uploading {file_path.name} to Google Drive")
    created = (
        service.files()
        .create(body=metadata, media_body=media, fields="id,name,webViewLink")
        .execute()
    )
    print(f"[db-backup] uploaded {created['name']} ({created['id']})")
    return created["id"]


def prune_old_backups(service, prefix: str) -> None:
    keep_count = int(get_env("BACKUP_KEEP_COUNT", "14"))
    if keep_count <= 0:
        return

    folder_id = get_env("GOOGLE_DRIVE_FOLDER_ID", "")
    q_parts = [
        "trashed = false",
        f"name contains '{prefix}'",
        "appProperties has { key='source' and value='tmhstore-db-backup' }",
    ]
    if folder_id:
        q_parts.append(f"'{folder_id}' in parents")

    response = (
        service.files()
        .list(
            q=" and ".join(q_parts),
            fields="files(id,name,createdTime)",
            orderBy="createdTime desc",
            pageSize=100,
        )
        .execute()
    )
    files = response.get("files", [])
    for old_file in files[keep_count:]:
        print(f"[db-backup] pruning old backup {old_file['name']} ({old_file['id']})")
        service.files().delete(fileId=old_file["id"]).execute()


def main() -> int:
    if not is_enabled():
        print("[db-backup] skipped because BACKUP_ENABLED is false")
        return 0

    backup_dir = Path(get_env("BACKUP_DIR", "/backups"))
    backup_dir.mkdir(parents=True, exist_ok=True)

    db_name = get_env("DB_NAME", required=True)
    prefix = get_env("BACKUP_FILE_PREFIX", f"{db_name}-mysql-backup")
    backup_file = backup_dir / f"{prefix}-{now_stamp()}.sql.gz"

    try:
        run_mysql_dump(backup_file)
        service = drive_service()
        upload_backup(service, backup_file)
        prune_old_backups(service, prefix)
        print("[db-backup] finished successfully")
        return 0
    finally:
        if backup_file.exists():
            backup_file.unlink()
        shutil.rmtree(backup_dir / "__pycache__", ignore_errors=True)


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"[db-backup] failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
