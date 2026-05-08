from fastapi import Depends, File, UploadFile

from app.core import BaseApiRouter, SuccessResponse, RequireAdminDep
from .schemas import ProductCreateRequest, ProductListQuery, ProductUpdateRequest
from .service import ProductService, get_product_read_service, get_product_write_service

router = BaseApiRouter(tags=["products"])


@router.get("/products")
async def get_products(
    query: ProductListQuery = Depends(),
    service: ProductService = Depends(get_product_read_service),
):
    return SuccessResponse(data=service.get_list(query))


@router.get("/products/slug/{slug}")
async def get_product_by_slug(
    slug: str,
    service: ProductService = Depends(get_product_read_service),
):
    return SuccessResponse(data=service.get_by_slug(slug))


@router.get("/products/{product_id}")
async def get_product(
    product_id: int,
    service: ProductService = Depends(get_product_read_service),
):
    return SuccessResponse(data=service.get(product_id))


@router.get("/admin/products", dependencies=[RequireAdminDep])
async def admin_get_products(
    query: ProductListQuery = Depends(),
    service: ProductService = Depends(get_product_read_service),
):
    return SuccessResponse(data=service.admin_get_list(query))


@router.get("/admin/products/{product_id}", dependencies=[RequireAdminDep])
async def admin_get_product(
    product_id: int,
    service: ProductService = Depends(get_product_read_service),
):
    return SuccessResponse(data=service.admin_get(product_id))


@router.post("/admin/products", dependencies=[RequireAdminDep])
async def create_product(
    payload: ProductCreateRequest,
    service: ProductService = Depends(get_product_write_service),
):
    return SuccessResponse(data=service.create(payload))


@router.put("/admin/products/{product_id}", dependencies=[RequireAdminDep])
async def update_product(
    product_id: int,
    payload: ProductUpdateRequest,
    service: ProductService = Depends(get_product_write_service),
):
    return SuccessResponse(data=service.update(product_id, payload))


@router.delete("/admin/products/{product_id}", dependencies=[RequireAdminDep])
async def delete_product(
    product_id: int,
    service: ProductService = Depends(get_product_write_service),
):
    return SuccessResponse(data=service.delete(product_id))


@router.post("/admin/products/import-csv", dependencies=[RequireAdminDep])
async def import_products_csv(
    file: UploadFile = File(...),
    service: ProductService = Depends(get_product_write_service),
):
    return SuccessResponse(data=service.import_csv(file))
