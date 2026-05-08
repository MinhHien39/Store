import os
from dotenv import load_dotenv
from pathlib import Path
from ..utils import logger


def get_root_dir() -> str:
    # /root/
    base_dir = Path(__file__).resolve().parent.parent.parent.parent.parent
    return base_dir


def load_env() -> str:
    # /root/
    base_dir = get_root_dir()
    logger.info(f"Base directory: {base_dir}")

    env_type = os.environ.get("ENV", "local")
    logger.info(f"Environment type: {env_type}")

    # デフォルト開発・ロカル環境
    # /root/environment/.env.local
    env_map = {
        "dev": ".env.dev",
        "stg": ".env.stg",
        "prd": ".env.prd"
    }

    file_name = env_map.get(env_type, ".env.local")
    path = base_dir / 'environment' / file_name
    logger.debug(f"Using environment file at: {path}")

    load_dotenv(
        dotenv_path=path,
        override=True
    )
    logger.info("Environment variables loaded.")
    logger.info(f"APP_NAME: {os.getenv('APP_NAME')}")
