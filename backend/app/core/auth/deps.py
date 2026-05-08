# core/auth/deps.py
from fastapi import Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..error import UnauthorizedException, ErrorMessage
from ..utils import logger
from .token import TokenService
from .models import TokenPayload

security = HTTPBearer(auto_error=True)

SecurityDep: HTTPAuthorizationCredentials = Depends(security)

# Require token authentication
async def require_token(
    credentials: HTTPAuthorizationCredentials = SecurityDep
) -> TokenPayload:
    """
    Validate token and return structured payload
    Returns TokenPayload object instead of raw dict
    """
    logger.debug("Requiring token authentication")
    # Extract token from credentials
    token = credentials.credentials

    # Validate token and get payload
    raw_payload = TokenService.execute(token)

    # Check if payload is valid
    if not raw_payload:
        raise UnauthorizedException(message=ErrorMessage.TOKEN_NOT_FOUND)
    
    # Convert to structured TokenPayload
    try:
        token_payload = TokenPayload(**raw_payload)
    except Exception as e:
        logger.error(f"Invalid token payload structure: {e}")
        raise UnauthorizedException(message=ErrorMessage.TOKEN_NOT_FOUND)
    
    return token_payload

# Get access_token from credentials
async def get_access_token(
    credentials: HTTPAuthorizationCredentials = SecurityDep
) -> str:
    return credentials.credentials


async def get_refresh_token(request: Request) -> str | None:
    """Resolve refresh token cookie by role_id first, then fallback to scan."""
    role_id_from_query_params = request.query_params.get("role_id")
    if role_id_from_query_params is not None:
        try:
            role_id = int(role_id_from_query_params)
            key = f"refresh_token_{role_id}"
            value = request.cookies.get(key)
            if value:
                TokenService.execute(value, is_refresh=True)
                return value
        except Exception as error:
            raise UnauthorizedException(message=ErrorMessage.TOKEN_IS_INVALID)

# Require admin role
async def require_admin(
    token_payload: TokenPayload = Depends(require_token)
) -> TokenPayload:
    """
    Require that the current user is an admin
    Returns TokenPayload if admin, raises UnauthorizedException otherwise
    """
    logger.debug("Requiring admin role")
    
    # Check if user is admin
    if not token_payload.is_admin:
        raise UnauthorizedException(message="管理者権限が必要です")
    
    logger.debug(f"Admin access granted for user_id={token_payload.user_id}, role_id={token_payload.role_id}")
    return token_payload

# Require store user role
async def require_store_user(
    token_payload: TokenPayload = Depends(require_token)
) -> TokenPayload:
    """
    Require that the current user is a store user
    Returns TokenPayload if store user, raises UnauthorizedException otherwise
    """
    logger.debug("Requiring store user role")
    
    if not token_payload.is_store_user:
        raise UnauthorizedException(message="User access required")
    
    logger.debug(f"Store user access granted for user_id={token_payload.user_id}, role_id={token_payload.role_id}")
    return token_payload

# Dependencies
TokenPayloadDep: TokenPayload = Depends(require_token)
RequireTokenDep: TokenPayload = Depends(require_token)
RequireAdminDep: TokenPayload = Depends(require_admin)
RequireStoreUserDep: TokenPayload = Depends(require_store_user)
AccessTokenDep: str = Depends(get_access_token)
RefreshTokenDep: str | None = Depends(get_refresh_token)