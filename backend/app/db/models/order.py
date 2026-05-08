from sqlmodel import Field

from .base import BaseDbModel


class Order(BaseDbModel, table=True):
    __tablename__ = "orders"

    id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    user_id: int = Field(nullable=False, foreign_key="users.id")
    status: int = Field(default=1, nullable=False)  # 1=pending, 2=confirmed, 3=shipping, 4=delivered, 5=cancelled
    total_amount: int = Field(nullable=False)
    shipping_name: str | None = Field(default=None, max_length=255, nullable=True)
    shipping_phone: str | None = Field(default=None, max_length=20, nullable=True)
    shipping_address: str | None = Field(default=None, max_length=500, nullable=True)
    notes: str | None = Field(default=None, max_length=500, nullable=True)
