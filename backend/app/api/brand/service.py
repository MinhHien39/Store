import re
import unicodedata

from sqlmodel import select

from app.core import BaseService, create_service, DataNotFoundException, DefaultException
from app.db import Brand, Product, ReadDbSessionDep, WriteDbSessionDep

from .schemas import BrandItem, BrandRequest


class BrandService(BaseService):
    @staticmethod
    def _slugify(value: str) -> str:
        normalized = unicodedata.normalize("NFKD", value.replace("đ", "d").replace("Đ", "D"))
        slug = re.sub(
            r"[^a-zA-Z0-9]+",
            "-",
            normalized.encode("ascii", "ignore").decode("ascii").lower(),
        ).strip("-")
        return slug or "brand"

    def _resolve_slug(self, name: str, slug: str | None, brand_id: int | None = None) -> str:
        base_slug = slug or self._slugify(name)

        if slug:
            stmt = select(Brand).where(Brand.slug == base_slug, Brand.is_deleted == False)
            if brand_id is not None:
                stmt = stmt.where(Brand.id != brand_id)
            existing = self.db.exec(stmt).first()
            if existing:
                raise DefaultException(message="Brand slug already exists")
            return base_slug

        candidate = base_slug
        index = 2
        while True:
            stmt = select(Brand).where(Brand.slug == candidate, Brand.is_deleted == False)
            if brand_id is not None:
                stmt = stmt.where(Brand.id != brand_id)
            existing = self.db.exec(stmt).first()
            if not existing:
                return candidate
            candidate = f"{base_slug}-{index}"
            index += 1

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
        slug = self._resolve_slug(payload.name, payload.slug)

        brand = Brand(
            name=payload.name,
            slug=slug,
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

        slug = self._resolve_slug(payload.name, payload.slug, brand_id=brand_id)

        brand.name = payload.name
        brand.slug = slug
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
