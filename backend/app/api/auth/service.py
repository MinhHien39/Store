from fastapi import Response
from sqlmodel import select

from app.core import (
    BaseService,
    create_service,
    settings,
    logger,
    PasswordHelper,
    DataNotFoundException,
    DefaultException,
    UnauthorizedException,
    AppException,
    UnknownException,
    ErrorMessage,
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
    StoreUser,
)
from .schemas import RegisterRequest, LoginRequest, ChangePasswordRequest


class AuthService(BaseService):

    def _set_refresh_token_cookie(
        self, response: Response, refresh_token: str, max_age: int, role_id: int
    ):
        response.set_cookie(
            key=f"refresh_token_{role_id}",
            path="/",
            value=refresh_token,
            httponly=True,
            secure=settings.SECURE,
            max_age=max_age,
            samesite="lax",
        )

    @staticmethod
    def _revoke_refresh_token_cookie(response: Response, role_id: int):
        response.delete_cookie(
            key=f"refresh_token_{role_id}",
            path="/",
            httponly=True,
            secure=settings.SECURE,
            samesite="lax",
        )

    def register(self, request: RegisterRequest) -> dict:
        role_id = UserRole.STORE_USER.value

        # Check duplicate email
        existing = self.db.exec(
            select(StoreUser).where(
                StoreUser.email == request.email,
                StoreUser.is_deleted == False,
            )
        ).first()
        if existing:
            raise DefaultException(message=ErrorMessage.EMAIL_EXISTS)

        user = StoreUser(
            full_name=request.full_name,
            email=request.email,
            password=PasswordHelper.hash_password(request.password),
            phone=request.phone,
            role_id=role_id,
            status=UserStatus.ACTIVE.to_value(),
            created_by=request.email,
        )
        self.db.add(user)
        self.db.flush()

        return user.to_json()

    def login(self, request: LoginRequest, response: Response) -> dict:
        role_id = UserRole.STORE_USER.value

        user = self.db.exec(
            select(StoreUser).where(
                StoreUser.email == request.email,
                StoreUser.is_deleted == False,
            )
        ).first()

        if not user:
            raise DataNotFoundException(message=ErrorMessage.USER_NOT_FOUND)

        if not user.password or not PasswordHelper.verify_password(request.password, user.password):
            raise DataNotFoundException(message=ErrorMessage.PASSWORD_INCORRECT)

        if UserStatus(user.status).is_inactive():
            raise DataNotFoundException(message=ErrorMessage.USER_IN_ACTIVE)

        token_payload = user.to_token_payload(role_id=role_id)
        token = TokenService.create(data=token_payload)

        refresh_ttl = token["refresh_ttl"]
        refresh_token = token["refresh_token"]
        token.pop("refresh_token", None)
        token.pop("refresh_expires_at", None)
        token.pop("refresh_ttl", None)

        data = {
            "user": {**user.to_json(), "role_id": role_id},
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
        raw_payload = TokenService.execute(token=access_token)
        role_id = raw_payload.get("role_id")
        TokenService.revoke(token=access_token)
        self._revoke_refresh_token_cookie(response=response, role_id=role_id)

    def me(self) -> dict:
        user = self.db.exec(
            select(StoreUser).where(
                StoreUser.id == self.token_payload.user_id,
                StoreUser.is_deleted == False,
            )
        ).first()
        if not user:
            raise DataNotFoundException(message=ErrorMessage.USER_NOT_FOUND)
        return {**user.to_json(), "role_id": self.token_payload.role_id}

    def change_password(self, request: ChangePasswordRequest) -> None:
        user = self.db.exec(
            select(StoreUser).where(
                StoreUser.id == self.token_payload.user_id,
                StoreUser.is_deleted == False,
            )
        ).first()
        if not user:
            raise DataNotFoundException(message=ErrorMessage.USER_NOT_FOUND)

        if not PasswordHelper.verify_password(request.old_password, user.password):
            raise DefaultException(message=ErrorMessage.PASSWORD_INCORRECT)

        user.password = PasswordHelper.hash_password(request.new_password)
        user.updated_by = self.current_user_name
        user.updated_at = self.updated_at
        self.db.add(user)

    def refresh_token(self, response: Response, refresh_token: str | None) -> dict:
        if not refresh_token:
            raise UnauthorizedException(message="Refresh token not found in cookies.")

        raw_payload = TokenService.execute(token=refresh_token, is_refresh=True)
        payload = TokenPayload(**raw_payload)

        user = self.db.exec(
            select(StoreUser).where(
                StoreUser.id == payload.user_id,
                StoreUser.is_deleted == False,
            )
        ).first()
        if not user:
            raise DataNotFoundException(message=ErrorMessage.USER_NOT_FOUND)

        token_payload = user.to_token_payload(role_id=payload.role_id)
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


get_auth_service = create_service(AuthService, WriteDbSessionDep, TokenPayloadDep)
get_auth_service_no_token = create_service(AuthService, WriteDbSessionDep)
