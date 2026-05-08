import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy import func
from sqlmodel import select

from app.core import BaseService, create_service, DataNotFoundException, DefaultException
from app.db import Product, ProductImage, ReadDbSessionDep, WriteDbSessionDep

from .schemas import ProductImageCreateResponse, ProductImageItem, ProductImageUpdateRequest

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


class ProductImageService(BaseService):
    def _to_item(self, image: ProductImage) -> ProductImageItem:
        return ProductImageItem(
            id=image.id,
            product_id=image.product_id,
            image_url=image.image_url,
            sort_order=image.sort_order,
            created_at=image.created_at,
            updated_at=image.updated_at,
        )

    def get_list_by_product(self, product_id: int) -> list[ProductImageItem]:
        images = self.db.exec(
            select(ProductImage)
            .where(ProductImage.product_id == product_id, ProductImage.is_deleted == False)
            .order_by(ProductImage.sort_order.asc(), ProductImage.id.asc())
        ).all()
        return [self._to_item(img) for img in images]

    def get(self, image_id: int) -> ProductImageItem:
        image = self.db.exec(
            select(ProductImage).where(ProductImage.id == image_id, ProductImage.is_deleted == False)
        ).first()
        if not image:
            raise DataNotFoundException(message="Image not found")
        return self._to_item(image)

    def create(self, product_id: int, files: list[UploadFile]) -> ProductImageCreateResponse:
        product = self.db.exec(
            select(Product).where(Product.id == product_id, Product.is_deleted == False)
        ).first()
        if not product:
            raise DataNotFoundException(message="Product not found")

        current_max_order = self.db.exec(
            select(func.coalesce(func.max(ProductImage.sort_order), 0)).where(
                ProductImage.product_id == product_id,
                ProductImage.is_deleted == False,
            )
        ).first() or 0

        upload_dir = Path("/backend/uploads/products") / str(product_id)
        upload_dir.mkdir(parents=True, exist_ok=True)

        urls: list[str] = []
        for idx, file in enumerate(files, start=1):
            # Validate file extension
            ext = Path(file.filename or "image.jpg").suffix.lower()
            if ext not in ALLOWED_EXTENSIONS:
                raise DefaultException(message=f"File type {ext} is not allowed")

            # Read file content
            content = file.file.read()
            if len(content) > MAX_FILE_SIZE:
                raise DefaultException(message="File size exceeds 10MB limit")

            filename = f"{uuid.uuid4().hex}{ext}"
            url = f"/uploads/products/{product_id}/{filename}"

            dest = upload_dir / filename
            dest.write_bytes(content)

            urls.append(url)
            image = ProductImage(
                product_id=product_id,
                image_url=url,
                sort_order=current_max_order + idx,
                created_by=self.created_by,
            )
            self.db.add(image)

        return ProductImageCreateResponse(product_id=product_id, image_urls=urls)

    def upload_main_image(self, product_id: int, file: UploadFile) -> str:
        """Upload a file, save to disk, update product.main_image_url, return the URL."""
        product = self.db.exec(
            select(Product).where(Product.id == product_id, Product.is_deleted == False)
        ).first()
        if not product:
            raise DataNotFoundException(message="Product not found")

        ext = Path(file.filename or "image.jpg").suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise DefaultException(message=f"File type {ext} is not allowed")

        content = file.file.read()
        if len(content) > MAX_FILE_SIZE:
            raise DefaultException(message="File size exceeds 10MB limit")

        upload_dir = Path("/backend/uploads/products") / str(product_id)
        upload_dir.mkdir(parents=True, exist_ok=True)

        filename = f"{uuid.uuid4().hex}{ext}"
        url = f"/uploads/products/{product_id}/{filename}"
        (upload_dir / filename).write_bytes(content)

        product.main_image_url = url
        self.db.add(product)

        return url

    def update(self, image_id: int, payload: ProductImageUpdateRequest) -> ProductImageItem:
        image = self.db.exec(
            select(ProductImage).where(ProductImage.id == image_id, ProductImage.is_deleted == False)
        ).first()
        if not image:
            raise DataNotFoundException(message="Image not found")

        if payload.sort_order is not None:
            image.sort_order = payload.sort_order
        image.updated_by = self.updated_by
        image.updated_at = self.updated_at
        self.db.add(image)
        self.db.flush()
        self.db.refresh(image)
        return self._to_item(image)

    def delete(self, image_id: int) -> dict:
        image = self.db.exec(
            select(ProductImage).where(ProductImage.id == image_id, ProductImage.is_deleted == False)
        ).first()
        if not image:
            raise DataNotFoundException(message="Image not found")

        image.is_deleted = True
        image.updated_by = self.updated_by
        image.updated_at = self.updated_at
        self.db.add(image)
        return {"id": image_id}


get_product_image_read_service = create_service(ProductImageService, ReadDbSessionDep)
get_product_image_write_service = create_service(ProductImageService, WriteDbSessionDep)
