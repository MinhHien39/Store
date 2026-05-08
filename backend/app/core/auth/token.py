"""
Token Service - JWT Token Management and User Context
"""
import jwt
from datetime import timedelta
import uuid

from ..cache import redis_client
from ..config import settings
from ..utils import logger, DateUtils
from ..error import DefaultException, UnauthorizedException, ErrorMessage
from .models import TokenPayload


class TokenService:
    """JWT Token Service for authentication"""

    @staticmethod   
    def create(
        data: TokenPayload,
        expires_delta: timedelta = None
    ) -> dict:
        """
        Create access and refresh tokens
        
        Args:
            data: TokenPayload object with user info
            expires_delta: Optional custom expiration time
            
        Returns:
            dict with access_token, refresh_token, and expiration info
        """
        try:
            # Convert TokenPayload to dict
            payload = data.to_dict()
            
            user_id = payload.get("user_id")
            role_id = payload.get("role_id")
            uid = f"{user_id}_{role_id}"
            session_id = payload.get("sid") or str(uuid.uuid4())

            now = DateUtils.utc()
            logger.debug(f"Current time for token creation: {now}")

            if expires_delta:
                access_expiration_time = now + expires_delta
            else:
                access_expiration_time = now + timedelta(seconds=settings.JWT_EXPIRE_SECONDS)

            # For refresh tokens, we might want a longer expiration
            refresh_expiration_time = now + timedelta(days=90)
            
            # Create the full payload with issued at and expiration times
            access_payload = {
                **payload,
                "sid": session_id,
                "iat": int(now.timestamp()),
                "nbf": int(now.timestamp()),
                "exp": int(access_expiration_time.timestamp())
            }
            logger.debug(f"Access token payload: {access_payload}")

            refresh_payload = {
                **payload,
                "sid": session_id,
                "iat": int(now.timestamp()),
                "nbf": int(now.timestamp()),
                "exp": int(refresh_expiration_time.timestamp())
            }
            logger.debug(f"Refresh token payload: {refresh_payload}")

            # Generate JWT token
            access_token = jwt.encode(
                access_payload,
                settings.JWT_SECRET_KEY,
                algorithm=settings.JWT_ALGORITHM
            )
            refresh_token = jwt.encode(
                refresh_payload,
                settings.JWT_SECRET_KEY,
                algorithm=settings.JWT_ALGORITHM
            )

            # Store token in Redis with TTL
            access_key = f"access:uid_{uid}:sid_{session_id}"
            access_ttl = int((access_expiration_time - now).total_seconds())

            refresh_key = f"refresh:uid_{uid}:sid_{session_id}"
            refresh_ttl = int((refresh_expiration_time - now).total_seconds())

            redis_client.set_token(
                key=access_key,
                value=access_token,
                ex=access_ttl
            )

            redis_client.set_token(
                key=refresh_key,
                value=refresh_token,
                ex=refresh_ttl
            )

            token = {
                "access_token": access_token,
                "access_expires_at": access_expiration_time.timestamp(),
                "access_ttl": access_ttl,
                "refresh_token": refresh_token,
                "refresh_expires_at": refresh_expiration_time.timestamp(),
                "refresh_ttl": refresh_ttl,
            }
            return token
        
        except Exception as e:
            raise DefaultException(message=f"Failed to create access token. {e}")
    

    @staticmethod
    def decode(token: str) -> TokenPayload:
        logger.debug("Decoding token")
        try:
            raw_payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
            
            # Convert to TokenPayload
            return TokenPayload(**raw_payload)

        except jwt.ExpiredSignatureError as e:
            logger.error(f"Token expired error: {e}")
            raise UnauthorizedException(message=ErrorMessage.TOKEN_IS_EXPIRED)
        
        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token error: {e}")
            raise UnauthorizedException(message=ErrorMessage.TOKEN_IS_INVALID)
        
        except Exception as e:
            logger.error(f"Token decode error: {e}")
            raise UnauthorizedException(message=ErrorMessage.TOKEN_IS_INVALID)

    
    @staticmethod
    def execute(token: str, is_refresh: bool = False) -> dict:
        try:
            token_payload = TokenService.decode(token)
            logger.debug(f"Token decoded successfully: user_id={token_payload.user_id}, role_id={token_payload.role_id}")
            
            uid = f"{token_payload.user_id}_{token_payload.role_id}"
            session_id: str = token_payload.extra_data.get("sid")

            # Check if token exists in Redis
            token_type = "refresh" if is_refresh else "access"
            key = f"{token_type}:uid_{uid}:sid_{session_id}"
            if not redis_client.token_exists(key):
                raise UnauthorizedException(message=ErrorMessage.TOKEN_IS_REVOKED)
            
            return token_payload.to_dict()
            
        except Exception as e:
            raise e
    
    @staticmethod
    def revoke(token: str) -> int:
        try:
            token_payload = TokenService.decode(token)
            logger.debug(f"Token decoded successfully for revocation: user_id={token_payload.user_id}")
            
            uid = f"{token_payload.user_id}_{token_payload.role_id}"
            session_id: str = token_payload.extra_data.get("sid")

            # Check if token exists in Redis
            access_key = f"access:uid_{uid}:sid_{session_id}"
            refresh_key = f"refresh:uid_{uid}:sid_{session_id}"

            deleted_count = 0
            deleted_count += redis_client.revoke_token(access_key)
            deleted_count += redis_client.revoke_token(refresh_key)

            logger.debug(f"Revoked tokens count: {deleted_count}")

            return deleted_count

        except Exception as e:
            raise e
        
    @staticmethod
    def revoke_pattern(token: str) -> int:
        try:
            token_payload = TokenService.decode(token)
            logger.debug(f"Token decoded successfully for revocation: user_id={token_payload.user_id}")
            
            uid = f"{token_payload.user_id}_{token_payload.role_id}"

            deleted_count = 0
            deleted_count += redis_client.revoke_pattern(f"access:uid_{uid}:*")
            deleted_count += redis_client.revoke_pattern(f"refresh:uid_{uid}:*")

            logger.debug(f"Revoked tokens count: {deleted_count}")
            return deleted_count

        except Exception as e:
            raise e
