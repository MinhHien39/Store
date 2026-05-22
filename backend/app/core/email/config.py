"""Email configuration."""
from fastapi_mail import ConnectionConfig

from app.core import settings


class EmailConfig:
    """Email configuration helper."""
    
    @staticmethod
    def get_connection_config() -> ConnectionConfig:
        """Build the FastMail connection configuration."""
        return ConnectionConfig(
            MAIL_USERNAME=settings.MAIL_USERNAME,
            MAIL_PASSWORD=settings.MAIL_PASSWORD,
            MAIL_FROM=settings.MAIL_FROM,
            MAIL_PORT=settings.MAIL_PORT,
            MAIL_SERVER=settings.MAIL_SERVER,
            MAIL_STARTTLS=settings.MAIL_STARTTLS,
            MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
            USE_CREDENTIALS=settings.MAIL_USE_CREDENTIALS,
            VALIDATE_CERTS=settings.MAIL_VALIDATE_CERTS
        )
    
    @staticmethod
    def is_production() -> bool:
        """Return whether the backend is running in production mode."""
        return settings.BACKEND_MODE.lower() in ("prd", "prod", "production")
