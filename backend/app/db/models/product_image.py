from sqlmodel import Field

from .base import BaseDbModel


class ProductImage(BaseDbModel, table=True):
    __tablename__ = "product_images"

    id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    product_id: int = Field(nullable=False, foreign_key="products.id")
    image_url: str = Field(max_length=255, nullable=False)
    sort_order: int = Field(default=0, nullable=False)
