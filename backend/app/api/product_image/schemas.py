from datetime import datetime

from pydantic import BaseModel, Field

from app.core.api.request import BaseRequest


class ProductImageItem(BaseModel):
    id: int
    product_id: int | None
    image_url: str
    sort_order: int
    created_at: datetime
    updated_at: datetime


class ProductImageCreateResponse(BaseModel):
    product_id: int
    image_urls: list[str]


class ProductImageUpdateRequest(BaseRequest):
    image_url: str | None = Field(default=None, max_length=255)
    sort_order: int | None = Field(default=None, ge=0)
