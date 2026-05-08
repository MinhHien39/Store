from datetime import datetime

from pydantic import BaseModel, Field

from app.core.api.request import BaseRequest


class CategoryItem(BaseModel):
    id: int
    name: str
    slug: str
    description: str | None = None
    image_url: str | None = None
    display_order: int = 0
    status: int = 1
    created_at: datetime
    updated_at: datetime | None = None


class CategoryRequest(BaseRequest):
    name: str = Field(min_length=1, max_length=255)
    slug: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=500)
    image_url: str | None = Field(default=None, max_length=255)
    display_order: int = Field(default=0)
    status: int = Field(default=1)
