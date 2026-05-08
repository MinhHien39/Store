from fastapi import Depends

from app.core import SuccessResponse, BaseApiRouter, RequireAdminDep, RequireStoreUserDep
from .schemas import CreateOrderRequest, UpdateOrderStatusRequest, OrderListQuery
from .service import OrderService, get_order_service, get_order_read_service

# User order routes
user_router = BaseApiRouter(prefix="/orders", tags=["orders"])

# Admin order routes
admin_router = BaseApiRouter(
    prefix="/admin/orders",
    tags=["admin-orders"],
    dependencies=[RequireAdminDep],
)


@user_router.post("")
async def create_order(
    request: CreateOrderRequest,
    service: OrderService = Depends(get_order_service),
):
    data = service.create_order(request=request)
    return SuccessResponse(data=data)


@user_router.get("")
async def get_my_orders(
    query: OrderListQuery = Depends(),
    service: OrderService = Depends(get_order_read_service),
):
    data = service.get_my_orders(query=query)
    return SuccessResponse(data=data)


@user_router.get("/{order_id}")
async def get_my_order_detail(
    order_id: int,
    service: OrderService = Depends(get_order_read_service),
):
    data = service.get_my_order_detail(order_id=order_id)
    return SuccessResponse(data=data)


@admin_router.get("")
async def get_all_orders(
    query: OrderListQuery = Depends(),
    service: OrderService = Depends(get_order_read_service),
):
    data = service.get_all_orders(query=query)
    return SuccessResponse(data=data)


@admin_router.get("/{order_id}")
async def get_order_detail(
    order_id: int,
    service: OrderService = Depends(get_order_read_service),
):
    data = service.get_order_detail_admin(order_id=order_id)
    return SuccessResponse(data=data)


@admin_router.put("/{order_id}/status")
async def update_order_status(
    order_id: int,
    request: UpdateOrderStatusRequest,
    service: OrderService = Depends(get_order_service),
):
    data = service.update_order_status(order_id=order_id, request=request)
    return SuccessResponse(data=data)
