"""
Admin Auth Service
"""
from fastapi import Response
from sqlmodel import select

from app.core import (
    BaseService,
    create_service,
    settings,
    logger,
    PasswordHelper,
    DataNotFoundException,
    UnauthorizedException,
    AppException,
    UnknownException,
    ErrorMessage,
    ErrorCode,
    TokenService,
    TokenPayload,
    TokenPayloadDep,
    UserRole,
    UserStatus,
    AccessTokenDep,
    RefreshTokenDep,
)
from app.db import (
    ReadDbSessionDep,
    WriteDbSessionDep,
    Admin,
)
from .schemas import LoginRequest


class AdminAuthService(BaseService):
    """
    Admin Auth Service
    """

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _login_admin(self, email: str, password: str) -> Admin:
        """Validate admin credentials"""
        try:
            stmt = select(Admin).where(
                Admin.email == email,
                Admin.is_deleted == False,
            )
            admin: Admin = self.db.exec(stmt).first()

            if not admin:
                raise DataNotFoundException(
                    message=ErrorMessage.USER_NOT_FOUND,
                )

            if not admin.password or not PasswordHelper.verify_password(password, admin.password):
                raise DataNotFoundException(
                    message=ErrorMessage.PASSWORD_INCORRECT,
                )

            return admin

        except Exception as e:
            if isinstance(e, AppException):
                raise e
            raise UnknownException(message=str(e))

    def _set_refresh_token_cookie(
        self,
        response: Response,
        refresh_token: str,
        max_age: int,
        role_id: int,
    ):
        """Set refresh token as HttpOnly cookie"""
        try:
            response.set_cookie(
                key=f"refresh_token_{role_id}",
                path="/",
                value=refresh_token,
                httponly=True,
                secure=settings.SECURE,
                max_age=max_age,
                samesite="lax",
            )
        except Exception as e:
            logger.error(f"Error setting refresh token cookie: {str(e)}")
            raise e

    @staticmethod
    def _revoke_refresh_token_cookie(response: Response, role_id: int):
        """Remove refresh token cookie"""
        try:
            response.delete_cookie(
                key=f"refresh_token_{role_id}",
                path="/",
                httponly=True,
                secure=settings.SECURE,
                samesite="lax",
            )
        except Exception as e:
            logger.error(f"Error revoking refresh token cookie: {str(e)}")
            raise e

    # ------------------------------------------------------------------
    # Public API methods
    # ------------------------------------------------------------------

    def login(self, request: LoginRequest, response: Response) -> dict:
        """Login"""
        role_id = UserRole.ADMIN.value

        admin = self._login_admin(
            email=request.email,
            password=request.password,
        )
        if not admin:
            raise DataNotFoundException()

        token_payload = admin.to_token_payload(role_id=role_id)
        token = TokenService.create(data=token_payload)

        refresh_ttl = token["refresh_ttl"]
        refresh_token = token["refresh_token"]
        token.pop("refresh_token", None)
        token.pop("refresh_expires_at", None)
        token.pop("refresh_ttl", None)

        data = {
            "user": {
                **admin.to_json(),
                "role_id": role_id,
            },
            "token": token,
        }

        self._set_refresh_token_cookie(
            response=response,
            refresh_token=refresh_token,
            max_age=refresh_ttl,
            role_id=role_id,
        )
        return data

    def logout(self, response: Response, access_token: str) -> None:
        """Logout"""
        raw_payload = TokenService.execute(token=access_token)
        role_id = raw_payload.get("role_id")
        TokenService.revoke(token=access_token)
        self._revoke_refresh_token_cookie(response=response, role_id=role_id)

    def refresh_token(
        self,
        response: Response,
        refresh_token: str | None,
    ) -> dict:
        """Refresh token"""
        if not refresh_token:
            raise UnauthorizedException(message="Refresh token not found in cookies.")

        raw_payload = TokenService.execute(token=refresh_token, is_refresh=True)
        payload = TokenPayload(**raw_payload)

        admin = self.db.exec(
            select(Admin).where(
                Admin.id == payload.user_id,
                Admin.is_deleted == False,
            )
        ).first()

        if not admin:
            raise DataNotFoundException(message=ErrorMessage.USER_NOT_FOUND)

        token_payload = admin.to_token_payload(role_id=payload.role_id)

        TokenService.revoke(token=refresh_token)
        token = TokenService.create(data=token_payload)

        new_refresh_token = token["refresh_token"]
        refresh_ttl = token["refresh_ttl"]

        self._set_refresh_token_cookie(
            response=response,
            refresh_token=new_refresh_token,
            max_age=refresh_ttl,
            role_id=payload.role_id,
        )

        token.pop("refresh_token", None)
        token.pop("refresh_expires_at", None)
        token.pop("refresh_ttl", None)
        return token

    def info(self) -> dict:
        """Get current admin info"""
        admin = self.db.exec(
            select(Admin).where(
                Admin.id == self.token_payload.user_id,
                Admin.is_deleted == False,
            )
        ).first()

        if not admin:
            raise DataNotFoundException(message=ErrorMessage.USER_NOT_FOUND)

        return {
            **admin.to_json(),
            "role_id": self.token_payload.role_id,
        }


# Service dependencies
get_admin_auth_service = create_service(AdminAuthService, WriteDbSessionDep, TokenPayloadDep)
get_admin_auth_service_no_token = create_service(AdminAuthService, WriteDbSessionDep)
