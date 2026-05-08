from sqlmodel import Field

from .base import BaseDbModel


class Category(BaseDbModel, table=True):
    __tablename__ = "categories"

    id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    name: str = Field(max_length=255, nullable=False, index=True)
    slug: str = Field(max_length=255, nullable=False, unique=True)
    icon: str | None = Field(default="package", max_length=50, nullable=True)
    description: str | None = Field(default=None, max_length=500, nullable=True)
    image_url: str | None = Field(default=None, max_length=255, nullable=True)
    display_order: int = Field(default=0, nullable=False)
    status: int = Field(default=1, nullable=False)
