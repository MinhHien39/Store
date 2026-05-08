from sqlmodel import select

from app.core import BaseService, create_service, DataNotFoundException, DefaultException
from app.db import Brand, Product, ReadDbSessionDep, WriteDbSessionDep

from .schemas import BrandItem, BrandRequest


class BrandService(BaseService):
    def _to_item(self, brand: Brand) -> BrandItem:
        return BrandItem(
            id=brand.id,
            name=brand.name,
            slug=brand.slug,
            description=brand.description,
            logo_url=brand.logo_url,
            display_order=brand.display_order,
            status=brand.status,
            created_at=brand.created_at,
            updated_at=brand.updated_at,
        )

    def get_list(self) -> list[BrandItem]:
        brands = self.db.exec(
            select(Brand)
            .where(Brand.is_deleted == False, Brand.status == 1)
            .order_by(Brand.display_order.asc())
        ).all()
        return [self._to_item(b) for b in brands]

    def get(self, brand_id: int) -> BrandItem:
        brand = self.db.exec(
            select(Brand).where(Brand.id == brand_id, Brand.is_deleted == False)
        ).first()
        if not brand:
            raise DataNotFoundException(message="Brand not found")
        return self._to_item(brand)

    def create(self, payload: BrandRequest) -> BrandItem:
        existing = self.db.exec(
            select(Brand).where(Brand.slug == payload.slug, Brand.is_deleted == False)
        ).first()
        if existing:
            raise DefaultException(message="Brand slug already exists")

        brand = Brand(
            name=payload.name,
            slug=payload.slug,
            description=payload.description,
            logo_url=payload.logo_url,
            display_order=payload.display_order,
            status=payload.status,
            created_by=self.created_by,
        )
        self.db.add(brand)
        self.db.flush()
        self.db.refresh(brand)
        return self._to_item(brand)

    def update(self, brand_id: int, payload: BrandRequest) -> BrandItem:
        brand = self.db.exec(
            select(Brand).where(Brand.id == brand_id, Brand.is_deleted == False)
        ).first()
        if not brand:
            raise DataNotFoundException(message="Brand not found")

        existing = self.db.exec(
            select(Brand).where(
                Brand.slug == payload.slug,
                Brand.id != brand_id,
                Brand.is_deleted == False,
            )
        ).first()
        if existing:
            raise DefaultException(message="Brand slug already exists")

        brand.name = payload.name
        brand.slug = payload.slug
        brand.description = payload.description
        brand.logo_url = payload.logo_url
        brand.display_order = payload.display_order
        brand.status = payload.status
        brand.updated_by = self.updated_by
        brand.updated_at = self.updated_at
        self.db.add(brand)
        self.db.flush()
        self.db.refresh(brand)
        return self._to_item(brand)

    def delete(self, brand_id: int) -> dict:
        brand = self.db.exec(
            select(Brand).where(Brand.id == brand_id, Brand.is_deleted == False)
        ).first()
        if not brand:
            raise DataNotFoundException(message="Brand not found")

        has_products = self.db.exec(
            select(Product.id).where(
                Product.brand_id == brand_id,
                Product.is_deleted == False,
            ).limit(1)
        ).first()
        if has_products:
            raise DefaultException(message="Brand is in use by products")

        brand.is_deleted = True
        brand.updated_by = self.updated_by
        brand.updated_at = self.updated_at
        self.db.add(brand)
        return {"id": brand_id}


get_brand_read_service = create_service(BrandService, ReadDbSessionDep)
get_brand_write_service = create_service(BrandService, WriteDbSessionDep)
