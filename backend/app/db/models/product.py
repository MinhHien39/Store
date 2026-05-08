from sqlmodel import Field

from .base import BaseDbModel


class Product(BaseDbModel, table=True):
    __tablename__ = "products"

    id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    category_id: int | None = Field(default=None, foreign_key="categories.id", nullable=True)
    brand_id: int | None = Field(default=None, foreign_key="brands.id", nullable=True)
    name: str = Field(max_length=255, nullable=False, index=True)
    slug: str | None = Field(default=None, max_length=255, nullable=True, unique=True)
    short_description: str | None = Field(default=None, max_length=255, nullable=True)
    description: str | None = Field(default=None, nullable=True)
    price: int = Field(nullable=False)
    sale_price: int | None = Field(default=None, nullable=True)
    stock_quantity: int = Field(default=0, nullable=False)
    main_image_url: str | None = Field(default=None, max_length=255, nullable=True)
    display_order: int = Field(default=0, nullable=False)
    status: int = Field(default=1, nullable=False)
