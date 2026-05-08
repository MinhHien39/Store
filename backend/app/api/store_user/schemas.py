from datetime import datetime

from pydantic import BaseModel, Field

from app.core.api.request import BaseFilterQuery, BaseRequest


class StoreUserItem(BaseModel):
    id: int
    full_name: str | None = None
    email: str
    phone: str | None = None
    role_id: int = 2
    status: int = 1
    created_at: datetime
    updated_at: datetime | None = None


class StoreUserListQuery(BaseFilterQuery):
    keyword: str | None = Field(default=None)
    status: int | None = Field(default=None)


class StoreUserCreateRequest(BaseRequest):
    full_name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=150)
    password: str = Field(min_length=6, max_length=255)
    phone: str | None = Field(default=None, max_length=20)
    status: int = Field(default=1)


class StoreUserUpdateRequest(BaseRequest):
    full_name: str | None = Field(default=None, min_length=1, max_length=100)
    email: str | None = Field(default=None, min_length=3, max_length=150)
    password: str | None = Field(default=None, min_length=6, max_length=255)
    phone: str | None = Field(default=None, max_length=20)
    status: int | None = Field(default=None)
