from fastapi import Depends, File, UploadFile

from app.core import BaseApiRouter, SuccessResponse, RequireAdminDep
from .schemas import ProductImageCreateResponse, ProductImageItem, ProductImageUpdateRequest
from .service import ProductImageService, get_product_image_read_service, get_product_image_write_service

router = BaseApiRouter(tags=["product-images"])


@router.get("/products/{product_id}/images")
async def get_product_images(
    product_id: int,
    service: ProductImageService = Depends(get_product_image_read_service),
):
    return SuccessResponse(data=service.get_list_by_product(product_id))


@router.get("/product-images/{image_id}")
async def get_product_image(
    image_id: int,
    service: ProductImageService = Depends(get_product_image_read_service),
):
    return SuccessResponse(data=service.get(image_id))


@router.post("/admin/products/{product_id}/images", dependencies=[RequireAdminDep])
async def create_product_images(
    product_id: int,
    files: list[UploadFile] = File(...),
    service: ProductImageService = Depends(get_product_image_write_service),
):
    return SuccessResponse(data=service.create(product_id, files))


@router.put("/admin/product-images/{image_id}", dependencies=[RequireAdminDep])
async def update_product_image(
    image_id: int,
    payload: ProductImageUpdateRequest,
    service: ProductImageService = Depends(get_product_image_write_service),
):
    return SuccessResponse(data=service.update(image_id, payload))


@router.delete("/admin/product-images/{image_id}", dependencies=[RequireAdminDep])
async def delete_product_image(
    image_id: int,
    service: ProductImageService = Depends(get_product_image_write_service),
):
    return SuccessResponse(data=service.delete(image_id))
