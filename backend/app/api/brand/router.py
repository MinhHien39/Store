from fastapi import Depends

from app.core import BaseApiRouter, SuccessResponse, RequireAdminDep
from .schemas import BrandItem, BrandRequest
from .service import BrandService, get_brand_read_service, get_brand_write_service

router = BaseApiRouter(tags=["brands"])


@router.get("/brands")
async def get_brands(service: BrandService = Depends(get_brand_read_service)):
    return SuccessResponse(data=service.get_list())


@router.get("/brands/{brand_id}")
async def get_brand(
    brand_id: int,
    service: BrandService = Depends(get_brand_read_service),
):
    return SuccessResponse(data=service.get(brand_id))


@router.post("/admin/brands", dependencies=[RequireAdminDep])
async def create_brand(
    payload: BrandRequest,
    service: BrandService = Depends(get_brand_write_service),
):
    return SuccessResponse(data=service.create(payload))


@router.put("/admin/brands/{brand_id}", dependencies=[RequireAdminDep])
async def update_brand(
    brand_id: int,
    payload: BrandRequest,
    service: BrandService = Depends(get_brand_write_service),
):
    return SuccessResponse(data=service.update(brand_id, payload))


@router.delete("/admin/brands/{brand_id}", dependencies=[RequireAdminDep])
async def delete_brand(
    brand_id: int,
    service: BrandService = Depends(get_brand_write_service),
):
    return SuccessResponse(data=service.delete(brand_id))
