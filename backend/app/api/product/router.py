from fastapi import Depends, File, Request, UploadFile

from app.core import BaseApiRouter, SuccessResponse, RequireAdminDep, RequireStoreUserDep
from .schemas import (
    ProductCreateRequest,
    ProductListQuery,
    ProductReviewCreateRequest,
    ProductReviewListQuery,
    ProductReviewUpdateStatusRequest,
    ProductUpdateRequest,
    ProductViewStatsQuery,
    ProductViewTrackRequest,
)
from .service import ProductService, get_product_read_service, get_product_user_write_service, get_product_write_service

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


@router.post("/products/{product_id}/views")
async def track_product_view(
    product_id: int,
    request: Request,
    payload: ProductViewTrackRequest | None = None,
    service: ProductService = Depends(get_product_write_service),
):
    return SuccessResponse(data=service.track_view(product_id, payload, request))


@router.get("/products/{product_id}/reviews")
async def get_product_reviews(
    product_id: int,
    query: ProductReviewListQuery = Depends(),
    service: ProductService = Depends(get_product_read_service),
):
    return SuccessResponse(data=service.get_reviews(product_id, query))


@router.post("/products/{product_id}/reviews", dependencies=[RequireStoreUserDep])
async def create_product_review(
    product_id: int,
    payload: ProductReviewCreateRequest,
    service: ProductService = Depends(get_product_user_write_service),
):
    return SuccessResponse(data=service.create_or_update_review(product_id, payload))


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


@router.get("/admin/product-views", dependencies=[RequireAdminDep])
async def admin_get_product_view_stats(
    query: ProductViewStatsQuery = Depends(),
    service: ProductService = Depends(get_product_read_service),
):
    return SuccessResponse(data=service.admin_get_view_stats(query))


@router.get("/admin/product-reviews", dependencies=[RequireAdminDep])
async def admin_get_product_reviews(
    query: ProductReviewListQuery = Depends(),
    service: ProductService = Depends(get_product_read_service),
):
    return SuccessResponse(data=service.admin_get_reviews(query))


@router.patch("/admin/product-reviews/{review_id}/status", dependencies=[RequireAdminDep])
async def admin_update_product_review_status(
    review_id: int,
    payload: ProductReviewUpdateStatusRequest,
    service: ProductService = Depends(get_product_write_service),
):
    return SuccessResponse(data=service.update_review_status(review_id, payload))


@router.delete("/admin/product-reviews/{review_id}", dependencies=[RequireAdminDep])
async def admin_delete_product_review(
    review_id: int,
    service: ProductService = Depends(get_product_write_service),
):
    return SuccessResponse(data=service.delete_review(review_id))


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
