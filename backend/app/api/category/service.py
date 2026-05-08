import re
import unicodedata

from sqlmodel import select

from app.core import BaseService, create_service, DataNotFoundException, DefaultException
from app.db import Category, Product, ReadDbSessionDep, WriteDbSessionDep

from .schemas import CategoryItem, CategoryRequest


class CategoryService(BaseService):
    @staticmethod
    def _slugify(value: str) -> str:
        normalized = unicodedata.normalize("NFKD", value.replace("đ", "d").replace("Đ", "D"))
        slug = re.sub(
            r"[^a-zA-Z0-9]+",
            "-",
            normalized.encode("ascii", "ignore").decode("ascii").lower(),
        ).strip("-")
        return slug or "category"

    def _resolve_slug(self, name: str, slug: str | None, category_id: int | None = None) -> str:
        base_slug = slug or self._slugify(name)

        if slug:
            stmt = select(Category).where(Category.slug == base_slug, Category.is_deleted == False)
            if category_id is not None:
                stmt = stmt.where(Category.id != category_id)
            existing = self.db.exec(stmt).first()
            if existing:
                raise DefaultException(message="Category slug already exists")
            return base_slug

        candidate = base_slug
        index = 2
        while True:
            stmt = select(Category).where(Category.slug == candidate, Category.is_deleted == False)
            if category_id is not None:
                stmt = stmt.where(Category.id != category_id)
            existing = self.db.exec(stmt).first()
            if not existing:
                return candidate
            candidate = f"{base_slug}-{index}"
            index += 1

    def _to_item(self, category: Category) -> CategoryItem:
        return CategoryItem(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            image_url=category.image_url,
            display_order=category.display_order,
            status=category.status,
            created_at=category.created_at,
            updated_at=category.updated_at,
        )

    def get_list(self) -> list[CategoryItem]:
        categories = self.db.exec(
            select(Category)
            .where(Category.is_deleted == False, Category.status == 1)
            .order_by(Category.display_order.asc())
        ).all()
        return [self._to_item(c) for c in categories]

    def get(self, category_id: int) -> CategoryItem:
        category = self.db.exec(
            select(Category).where(Category.id == category_id, Category.is_deleted == False)
        ).first()
        if not category:
            raise DataNotFoundException(message="Category not found")
        return self._to_item(category)

    def create(self, payload: CategoryRequest) -> CategoryItem:
        slug = self._resolve_slug(payload.name, payload.slug)

        category = Category(
            name=payload.name,
            slug=slug,
            description=payload.description,
            image_url=payload.image_url,
            display_order=payload.display_order,
            status=payload.status,
            created_by=self.created_by,
        )
        self.db.add(category)
        self.db.flush()
        self.db.refresh(category)
        return self._to_item(category)

    def update(self, category_id: int, payload: CategoryRequest) -> CategoryItem:
        category = self.db.exec(
            select(Category).where(Category.id == category_id, Category.is_deleted == False)
        ).first()
        if not category:
            raise DataNotFoundException(message="Category not found")

        slug = self._resolve_slug(payload.name, payload.slug, category_id=category_id)

        category.name = payload.name
        category.slug = slug
        category.description = payload.description
        category.image_url = payload.image_url
        category.display_order = payload.display_order
        category.status = payload.status
        category.updated_by = self.updated_by
        category.updated_at = self.updated_at
        self.db.add(category)
        self.db.flush()
        self.db.refresh(category)
        return self._to_item(category)

    def delete(self, category_id: int) -> dict:
        category = self.db.exec(
            select(Category).where(Category.id == category_id, Category.is_deleted == False)
        ).first()
        if not category:
            raise DataNotFoundException(message="Category not found")

        has_products = self.db.exec(
            select(Product.id).where(
                Product.category_id == category_id,
                Product.is_deleted == False,
            ).limit(1)
        ).first()
        if has_products:
            raise DefaultException(message="Category is in use by products")

        category.is_deleted = True
        category.updated_by = self.updated_by
        category.updated_at = self.updated_at
        self.db.add(category)
        return {"id": category_id}


get_category_read_service = create_service(CategoryService, ReadDbSessionDep)
get_category_write_service = create_service(CategoryService, WriteDbSessionDep)
