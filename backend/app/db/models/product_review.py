from sqlmodel import Field, UniqueConstraint

from .base import BaseDbModel


class ProductReview(BaseDbModel, table=True):
    __tablename__ = "product_reviews"
    __table_args__ = (
        UniqueConstraint("product_id", "user_id", name="uq_product_reviews_product_user"),
    )

    id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    product_id: int = Field(nullable=False, foreign_key="products.id", index=True)
    product_name: str = Field(max_length=255, nullable=False, index=True)
    user_id: int = Field(nullable=False, foreign_key="users.id", index=True)
    user_name: str | None = Field(default=None, max_length=255, nullable=True)
    rating: int = Field(nullable=False, ge=1, le=5, index=True)
    comment: str | None = Field(default=None, nullable=True)
    status: int = Field(default=1, nullable=False, index=True)  # 1=visible, 2=hidden
