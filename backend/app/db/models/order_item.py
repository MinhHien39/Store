from datetime import datetime
from sqlmodel import Field

from .base import BaseDbModel


class OrderItem(BaseDbModel, table=True):
    __tablename__ = "order_items"

    id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    order_id: int = Field(nullable=False, foreign_key="orders.id")
    product_id: int = Field(nullable=False, foreign_key="products.id")
    quantity: int = Field(nullable=False)
    price: int = Field(nullable=False)
