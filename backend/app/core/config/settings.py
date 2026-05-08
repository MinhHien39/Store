# app/config/setting.py
import os
from .env import load_env, get_root_dir
load_env()

from ..utils import logger

class Settings:

    def __init__(self):
        logger.info("Loading settings from environment variables...")
    
    def print_all(self):
        for attr in dir(self):
            if not attr.startswith("__") and not callable(getattr(self, attr)):
                logger.info(f"{attr}: {getattr(self, attr)}")

    # Root directory
    ROOT_DIR: str = get_root_dir()

    # App
    APP_NAME: str = os.getenv("APP_NAME", "Store Backend Service")
    ENV: str = os.getenv("ENV", "local")

    SECURE = os.getenv("SECURE", "False").lower() in ("true", "1", "t")

    # Environment
    BACKEND_MODE: str = os.getenv("BACKEND_MODE", "dev")

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_SECONDS: int = int(os.getenv("JWT_EXPIRE_SECONDS", "900"))  # Default to 15 minutes

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/1")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "")
    
    # Email Settings
    MAIL_USERNAME: str = os.getenv("EMAIL_HOST_USER", "")
    MAIL_PASSWORD: str = os.getenv("EMAIL_HOST_PASSWORD", "")
    MAIL_FROM: str = os.getenv("MAIL_FROM", "noreply@store.com")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", "587"))
    MAIL_SERVER: str = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    MAIL_STARTTLS: bool = os.getenv("MAIL_STARTTLS", "True").lower() in ("true", "1", "t")
    MAIL_SSL_TLS: bool = os.getenv("MAIL_SSL_TLS", "False").lower() in ("true", "1", "t")
    MAIL_USE_CREDENTIALS: bool = os.getenv("MAIL_USE_CREDENTIALS", "True").lower() in ("true", "1", "t")
    MAIL_VALIDATE_CERTS: bool = os.getenv("MAIL_VALIDATE_CERTS", "True").lower() in ("true", "1", "t")
    
    # AWS SES Settings (for production email)
    AWS_REGION: str = os.getenv("AWS_REGION", "ap-northeast-1")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_SES_FROM_EMAIL: str = os.getenv("AWS_SES_FROM_EMAIL", "info@store.com")
    
    # S3
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME")

    # CORS
    CORS_ALLOWED_ORIGINS: list[str] = [
        o.strip() for o in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",") if o.strip()
    ]

    # Lambda settings
    LAMBDA_FUNCTION: str = os.getenv("LAMBDA_FUNCTION")


settings = Settings()
