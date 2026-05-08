from fastapi import Depends

from app.core import BaseApiRouter, SuccessResponse, RequireAdminDep
from .schemas import StoreUserCreateRequest, StoreUserListQuery, StoreUserUpdateRequest
from .service import StoreUserService, get_store_user_read_service, get_store_user_write_service

router = BaseApiRouter(
    tags=["admin-users"],
    dependencies=[RequireAdminDep],
)


@router.get("/admin/users")
async def get_users(
    query: StoreUserListQuery = Depends(),
    service: StoreUserService = Depends(get_store_user_read_service),
):
    return SuccessResponse(data=service.get_list(query))


@router.get("/admin/users/{user_id}")
async def get_user(
    user_id: int,
    service: StoreUserService = Depends(get_store_user_read_service),
):
    return SuccessResponse(data=service.get(user_id))


@router.post("/admin/users")
async def create_user(
    payload: StoreUserCreateRequest,
    service: StoreUserService = Depends(get_store_user_write_service),
):
    return SuccessResponse(data=service.create(payload))


@router.put("/admin/users/{user_id}")
async def update_user(
    user_id: int,
    payload: StoreUserUpdateRequest,
    service: StoreUserService = Depends(get_store_user_write_service),
):
    return SuccessResponse(data=service.update(user_id, payload))


@router.delete("/admin/users/{user_id}")
async def delete_user(
    user_id: int,
    service: StoreUserService = Depends(get_store_user_write_service),
):
    return SuccessResponse(data=service.delete(user_id))
