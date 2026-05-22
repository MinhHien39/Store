from datetime import datetime

from sqlmodel import Field

from app.core import DateUtils

from .base import BaseDbModel


class ProductView(BaseDbModel, table=True):
    __tablename__ = "product_views"

    id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    product_id: int = Field(nullable=False, foreign_key="products.id", index=True)
    product_name: str = Field(max_length=255, nullable=False, index=True)
    user_id: int | None = Field(default=None, foreign_key="users.id", nullable=True, index=True)
    anonymous_id: str | None = Field(default=None, max_length=128, nullable=True, index=True)
    session_id: str | None = Field(default=None, max_length=128, nullable=True, index=True)
    ip_address: str | None = Field(default=None, max_length=64, nullable=True, index=True)
    user_agent: str | None = Field(default=None, max_length=500, nullable=True)
    referrer: str | None = Field(default=None, max_length=500, nullable=True)
    source: str | None = Field(default="web", max_length=64, nullable=True, index=True)
    device_type: str | None = Field(default=None, max_length=32, nullable=True, index=True)
    browser: str | None = Field(default=None, max_length=64, nullable=True)
    os: str | None = Field(default=None, max_length=64, nullable=True)
    timezone: str | None = Field(default=None, max_length=64, nullable=True)
    viewed_path: str | None = Field(default=None, max_length=500, nullable=True)
    locale: str | None = Field(default=None, max_length=32, nullable=True)
    screen_width: int | None = Field(default=None, nullable=True)
    screen_height: int | None = Field(default=None, nullable=True)
    viewed_at: datetime = Field(default_factory=DateUtils.now, nullable=False, index=True)
