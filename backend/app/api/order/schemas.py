from pydantic import Field
from app.core import BaseRequest, BaseFilterQuery


class OrderItemRequest(BaseRequest):
    product_id: int = Field(..., examples=[1])
    quantity: int = Field(..., ge=1, examples=[2])


class CreateOrderRequest(BaseRequest):
    items: list[OrderItemRequest] = Field(..., min_length=1)
    shipping_name: str = Field(..., min_length=2, max_length=255, examples=["Nguyễn Văn A"])
    shipping_phone: str = Field(..., min_length=8, max_length=20, examples=["0901234567"])
    shipping_address: str = Field(..., min_length=5, max_length=500, examples=["123 Nguyễn Huệ, Q1, TP.HCM"])
    notes: str | None = Field(default=None, max_length=500, examples=["Giao giờ hành chính"])


class UpdateOrderStatusRequest(BaseRequest):
    status: int = Field(..., ge=1, le=5, examples=[2])


class OrderListQuery(BaseFilterQuery):
    status: int | None = Field(default=None, ge=1, le=5)
