from .base import BaseDbModel
from typing import Optional
from sqlalchemy import or_
from sqlmodel import Field, select, Session

from app.core import (
    logger,
    UserRole,
    UserStatus,
    TokenPayload,
    DefaultException,
    DataNotFoundException,
    ErrorMessage
)


class User(BaseDbModel, table=False):
    id: int | None = Field(
        default=None,
        primary_key=True,
        sa_column_kwargs={"autoincrement": True}
    )
    email: str = Field(max_length=255, index=True, nullable=True, unique=True)
    password: str | None = Field(default=None, max_length=255, nullable=True)
    full_name: str | None = Field(default=None, max_length=255, nullable=True, index=True)
    phone: str | None = Field(default=None, max_length=20, nullable=True)
    status: int = Field(default=UserStatus.ACTIVE.to_value(), nullable=True)

    def to_json(self) -> dict:
        data = super().to_json()
        del data["password"]
        return data

    def to_token_payload(self, role_id: int) -> TokenPayload:
        extra_data = {}
        return TokenPayload(
            user_id=self.id,
            role_id=role_id,
            user_name=self.full_name,
            extra_data=extra_data
        )

    @staticmethod
    def get_model_type_by_role(role_id: int) -> type["User"]:
        user_role = UserRole(role_id)
        if user_role == UserRole.ADMIN:
            return Admin
        elif user_role == UserRole.STORE_USER:
            return StoreUser
        raise ValueError(f"Invalid role_id: {role_id}")

    @staticmethod
    def validate_unique(
        db: Session,
        *,
        role_id: int,
        email: Optional[str] = None,
        target_id: Optional[int] = None
    ):
        role_model = User.get_model_type_by_role(role_id)

        self_model = None
        if target_id is not None:
            self_model = db.exec(
                select(role_model).where(
                    role_model.id == target_id,
                    role_model.is_deleted == False
                )
            ).first()
            if self_model is None:
                raise DataNotFoundException()

        conditions = []
        if email:
            conditions.append(role_model.email == email)

        if conditions:
            results = db.exec(
                select(role_model).where(
                    or_(*conditions),
                    role_model.is_deleted == False
                )
            ).all()

            for instance in results:
                if self_model is not None and instance.id == self_model.id:
                    continue
                if email and instance.email == email:
                    raise DefaultException(message=ErrorMessage.EMAIL_EXISTS)

        return self_model


class Admin(User, table=True):
    __tablename__ = "admins"


class StoreUser(User, table=True):
    __tablename__ = "users"
    role_id: int = Field(default=UserRole.STORE_USER.value, nullable=False)
