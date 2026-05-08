"""
メール送信サービス
環境に応じて FastAPI-Mail (local) または AWS SES (production) を使用
"""
from typing import Optional
from fastapi_mail import FastMail, MessageSchema, MessageType
import boto3

from app.core import settings, logger
from .templates import EmailTemplate
from .config import EmailConfig


class EmailService:
    """メール送信サービスクラス"""
    
    def __init__(self):
        """初期化: SES クライアントを設定"""
        self.ses_client = None
        
        # 本番環境の場合は SES クライアントを初期化
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
        """FastAPI-Mail経由でメール送信 (Local環境用)"""
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
        """AWS SES経由でメール送信 (Production環境用)"""
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
        """メール送信（環境に応じて自動選択）"""
        if EmailConfig.is_production() and self.ses_client:
            return await self._send_via_ses(email, subject, html_body)
        else:
            return await self._send_via_fastapi_mail(email, subject, html_body)
    
    async def send_verification_email(
        self,
        email: str,
        verification_code: str,
        user_name: Optional[str] = None,
        role_name: str = "ユーザー"
    ) -> bool:
        """認証メールを送信"""
        try:
            logger.info(f"Sending verification email to {email} with code {verification_code}")
            
            html_body = EmailTemplate.get_verification_email_html(
                verification_code=verification_code,
                user_name=user_name,
                role_name=role_name
            )
            
            success = await self.send_email(
                email=email,
                subject="【Store】メールアドレス認証コード",
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
        """パスワードリセットメールを送信"""
        try:
            html_body = EmailTemplate.get_password_reset_email_html(
                reset_password_url=reset_password_url,
                user_name=user_name
            )
            
            success = await self.send_email(
                email=email,
                subject="【Store】パスワード再設定のお知らせ",
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
