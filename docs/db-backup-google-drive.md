# Daily MySQL Backup to Google Drive

This project includes a `db-backup` Docker service that can dump the MySQL database, gzip the dump, upload it to Google Drive, and prune older backup files.

## Schedule

Default production schedule:

```text
0 0 * * *
```

This runs at `00:00` every day using `Asia/Ho_Chi_Minh` time.

## Required environment

Add these values to `environment/.env.prd` on the server:

```dotenv
DB_BACKUP_ENABLED=true
DB_BACKUP_CRON=0 0 * * *
DB_BACKUP_RUN_ON_STARTUP=false
DB_BACKUP_KEEP_COUNT=14
GOOGLE_DRIVE_FOLDER_ID=
```

Then configure one Google authentication method.

## Option A: Personal Google Drive OAuth

Use this option when the backup must upload directly to a personal Google Drive account.

```dotenv
GOOGLE_DRIVE_OAUTH_CLIENT_ID=...
GOOGLE_DRIVE_OAUTH_CLIENT_SECRET=...
GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN=...
```

The OAuth token must include the Drive file scope:

```text
https://www.googleapis.com/auth/drive.file
```

## Option B: Service account

Use this option when you can create a Drive folder and share that folder with a service-account email.

```dotenv
GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64=...
GOOGLE_DRIVE_FOLDER_ID=...
```

Encode the service account JSON as base64 before placing it in the env file.

## Start the backup service

```bash
docker compose -f compose.prd.yml --env-file environment/.env.prd up -d --build db-backup
```

## Run one backup immediately

Temporarily set:

```dotenv
DB_BACKUP_RUN_ON_STARTUP=true
```

Then recreate the service:

```bash
docker compose -f compose.prd.yml --env-file environment/.env.prd up -d --build --force-recreate db-backup
```

After confirming the upload, set `DB_BACKUP_RUN_ON_STARTUP=false` again.
