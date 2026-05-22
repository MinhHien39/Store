"""Email sending service.

Uses FastAPI-Mail locally and AWS SES in production.
"""
from typing import Optional
from fastapi_mail import FastMail, MessageSchema, MessageType
import boto3

from app.core import settings, logger
from .templates import EmailTemplate
from .config import EmailConfig


class EmailService:
    """Email sending service."""
    
    def __init__(self):
        """Initialize the SES client when production email is enabled."""
        self.ses_client = None
        
        if EmailConfig.is_production():
            try:
                self.ses_client = boto3.client(
                    'ses',
                    region_name=settings.AWS_REGION
                )
                logger.info("AWS SES client initialized for production email")
            except Exception as e:
                logger.error(f"Failed to initialize AWS SES client: {str(e)}")
                logger.warning("Falling back to FastAPI-Mail")

    async def _send_via_fastapi_mail(
        self,
        email: str,
        subject: str,
        html_body: str,
    ) -> bool:
        """Send email via FastAPI-Mail."""
        try:
            message = MessageSchema(
                subject=subject,
                recipients=[email],
                body=html_body,
                subtype=MessageType.html
            )
            
            conf = EmailConfig.get_connection_config()
            fm = FastMail(conf)
            await fm.send_message(message)
            
            logger.info(f"Email sent via FastAPI-Mail to {email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email via FastAPI-Mail to {email}: {str(e)}")
            return False
    
    async def _send_via_ses(
        self,
        email: str,
        subject: str,
        html_body: str,
    ) -> bool:
        """Send email via AWS SES."""
        if not self.ses_client:
            logger.error("SES client not initialized")
            return await self._send_via_fastapi_mail(email, subject, html_body)
        
        try:
            response = self.ses_client.send_email(
                Source=settings.AWS_SES_FROM_EMAIL,
                Destination={
                    'ToAddresses': [email]
                },
                Message={
                    'Subject': {
                        'Data': subject,
                        'Charset': 'UTF-8'
                    },
                    'Body': {
                        'Html': {
                            'Data': html_body,
                            'Charset': 'UTF-8'
                        }
                    }
                }
            )
            
            logger.info(f"Email sent via AWS SES to {email}, MessageId: {response.get('MessageId')}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email via AWS SES to {email}: {str(e)}")
            logger.warning("Falling back to FastAPI-Mail")
            return False
    
    async def send_email(
        self,
        email: str,
        subject: str,
        html_body: str,
    ) -> bool:
        """Send email with the configured provider."""
        if EmailConfig.is_production() and self.ses_client:
            return await self._send_via_ses(email, subject, html_body)
        else:
            return await self._send_via_fastapi_mail(email, subject, html_body)
    
    async def send_verification_email(
        self,
        email: str,
        verification_code: str,
        user_name: Optional[str] = None,
        role_name: str = "user"
    ) -> bool:
        """Send a verification email."""
        try:
            logger.info(f"Sending verification email to {email} with code {verification_code}")
            
            html_body = EmailTemplate.get_verification_email_html(
                verification_code=verification_code,
                user_name=user_name,
                role_name=role_name
            )
            
            success = await self.send_email(
                email=email,
                subject="[Store] Email verification code",
                html_body=html_body,
            )
            
            if success:
                logger.info(f"Verification email sent successfully to {email}")
            
            return success
            
        except Exception as e:
            logger.error(f"Failed to send verification email to {email}: {str(e)}")
            return False
    
    async def send_password_reset_email(
        self,
        email: str,
        reset_password_url: str,
        user_name: Optional[str] = None
    ) -> bool:
        """Send a password reset email."""
        try:
            html_body = EmailTemplate.get_password_reset_email_html(
                reset_password_url=reset_password_url,
                user_name=user_name
            )
            
            success = await self.send_email(
                email=email,
                subject="[Store] Password reset",
                html_body=html_body,
            )
            
            if success:
                logger.info(f"Password reset email sent successfully to {email}")
            
            return success
            
        except Exception as e:
            logger.error(f"Failed to send password reset email to {email}: {str(e)}")
            return False
    



# Singleton instance
email_service = EmailService()
