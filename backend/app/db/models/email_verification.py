import random
import string

from datetime import datetime
from sqlmodel import Field, Session, select
from sqlalchemy import update
from typing import Optional

from app.core import DateUtils, logger, DefaultException
from .base import BaseDbModel


class EmailVerification(BaseDbModel, table=True):
    """
    Email verification model
    Used for verifying email addresses during admin and user registration/updates
    """
    __tablename__ = "email_verifications"
    
    # ID, auto increment
    id: int | None = Field(
        default=None,
        primary_key=True,
        sa_column_kwargs={"autoincrement": True}
    )
    
    # Email address (unique in system)
    email: str = Field(max_length=255, nullable=False, index=True)
    
    # Verification code (6-digit number or random string)
    verification_code: str = Field(max_length=100, nullable=False, index=True)
    
    # Expiry time (default: 15 minutes from creation)
    expires_at: datetime = Field(nullable=False)
    
    # Resend allowed time (default: 30 seconds from creation)
    resend_at: datetime | None = Field(default=None, nullable=True)
    
    # Verified flag
    is_verified: bool = Field(default=False, nullable=False)
    
    @staticmethod
    def create_verification(
        db: Session,
        email: str,
        verification_code: str,
        expires_minutes: int = 15
    ) -> tuple["EmailVerification", str]:
        """Create or update a verification record (includes all validation)"""
        # Check 1: Is email already verified?
        existing_verified = db.exec(
            select(EmailVerification)
            .where(
                EmailVerification.email == email,
                EmailVerification.is_verified == True,
                EmailVerification.is_deleted == False
            )
        ).first()
        
        if existing_verified:
            raise DefaultException(message="This email address is already in use")
        
        # Check 2: Is there a pending verification record?
        existing_verification = EmailVerification.get_latest_verification(db, email)
        
        # Check 3: Cooldown check (may raise an exception)
        if existing_verification:
            EmailVerification.can_resend(db, email)
        
        now = DateUtils.now()
        expires_at = DateUtils.add_minutes(now, expires_minutes)
        resend_at = DateUtils.add_seconds(now, 30)
        
        # Update or create
        if existing_verification and not existing_verification.is_verified:
            # Update existing pending verification record
            existing_verification.verification_code = verification_code
            existing_verification.created_at = now
            existing_verification.expires_at = expires_at
            existing_verification.resend_at = resend_at
            existing_verification.updated_at = now
            
            db.add(existing_verification)
            db.flush()
            db.refresh(existing_verification)
            
            logger.info(f"Updated email verification for email={email}")
            return existing_verification, "Verification code updated"
        else:
            # Create new verification record
            verification = EmailVerification(
                email=email,
                verification_code=verification_code,
                expires_at=expires_at,
                resend_at=resend_at,
                is_verified=False
            )
            
            db.add(verification)
            db.flush()
            db.refresh(verification)
            
            logger.info(f"Created email verification for email={email}")
            return verification, "Verification code created"
    
    @staticmethod
    def get_latest_verification(
        db: Session,
        email: str
    ) -> Optional["EmailVerification"]:
        """Get the latest verification record for an email address"""
        statement = (
            select(EmailVerification)
            .where(
                EmailVerification.email == email,
                EmailVerification.is_deleted == False
            )
            .order_by(EmailVerification.created_at.desc())
        )
        
        result = db.exec(statement).first()
        return result
    
    @staticmethod
    def verify_code(
        db: Session,
        email: str,
        verification_code: str,
        old_email: Optional[str] = None
    ) -> str:
        """Verify a verification code for an email address"""
        verification = EmailVerification.get_latest_verification(db, email)
        
        if not verification:
            raise DefaultException(message="Verification code not found")
        
        if verification.is_verified:
            raise DefaultException(message="Already verified")
        
        # Expiry check
        now = DateUtils.now()
        if now > verification.expires_at:
            raise DefaultException(message="Verification code has expired")
        
        # Code check
        if verification.verification_code != verification_code:
            raise DefaultException(message="Verification code is incorrect")
        
        # Verification success
        verification.is_verified = True
        verification.updated_at = now
        db.add(verification)
        
        # If old_email is specified, soft-delete the old email verification records
        if old_email:
            email_verifications_update = (
                update(EmailVerification)
                    .where(
                        EmailVerification.email == old_email,
                        EmailVerification.is_deleted == False
                    )
                    .values(
                        is_deleted=True,
                        updated_at=now
                    )
            )
            db.exec(email_verifications_update)
            
        db.flush()
        
        logger.info(f"Email verified successfully for email={email}")
        return "Email verification completed"
    
    @staticmethod
    def can_resend(
        db: Session,
        email: str
    ) -> None:
        """Check whether resend is allowed"""
        verification = EmailVerification.get_latest_verification(db, email)
        
        if not verification:
            return  # Resend allowed
        
        if verification.is_verified:
            raise DefaultException(message="Already verified")
        
        now = DateUtils.now()
        
        # If resend_at is set and the time has not yet been reached
        if verification.resend_at and now < verification.resend_at:
            remaining_seconds = int((verification.resend_at - now).total_seconds())
            raise DefaultException(message=f"Resend available in {remaining_seconds} seconds")
        
        # Resend allowed
    
    def to_json(self) -> dict:
        """JSON serialize (exclude sensitive info)"""
        data = super().to_json()
        # Do not return verification code
        if 'verification_code' in data:
            del data['verification_code']
        return data


    @staticmethod
    def generate_verification_code(length: int = 6) -> str:
        """Generate a verification code (6-digit number)"""
        return ''.join(random.choices(string.digits, k=length))