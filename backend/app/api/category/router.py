from fastapi import Depends

from app.core import BaseApiRouter, SuccessResponse, RequireAdminDep
from .schemas import CategoryItem, CategoryRequest
from .service import CategoryService, get_category_read_service, get_category_write_service

router = BaseApiRouter(tags=["categories"])


@router.get("/categories")
async def get_categories(service: CategoryService = Depends(get_category_read_service)):
    return SuccessResponse(data=service.get_list())


@router.get("/categories/{category_id}")
async def get_category(
    category_id: int,
    service: CategoryService = Depends(get_category_read_service),
):
    return SuccessResponse(data=service.get(category_id))


@router.post("/admin/categories", dependencies=[RequireAdminDep])
async def create_category(
    payload: CategoryRequest,
    service: CategoryService = Depends(get_category_write_service),
):
    return SuccessResponse(data=service.create(payload))


@router.put("/admin/categories/{category_id}", dependencies=[RequireAdminDep])
async def update_category(
    category_id: int,
    payload: CategoryRequest,
    service: CategoryService = Depends(get_category_write_service),
):
    return SuccessResponse(data=service.update(category_id, payload))


@router.delete("/admin/categories/{category_id}", dependencies=[RequireAdminDep])
async def delete_category(
    category_id: int,
    service: CategoryService = Depends(get_category_write_service),
):
    return SuccessResponse(data=service.delete(category_id))
