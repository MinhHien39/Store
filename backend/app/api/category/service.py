from sqlmodel import select

from app.core import BaseService, create_service, DataNotFoundException, DefaultException
from app.db import Category, Product, ReadDbSessionDep, WriteDbSessionDep

from .schemas import CategoryItem, CategoryRequest


class CategoryService(BaseService):
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
        # Check slug uniqueness
        existing = self.db.exec(
            select(Category).where(Category.slug == payload.slug, Category.is_deleted == False)
        ).first()
        if existing:
            raise DefaultException(message="Category slug already exists")

        category = Category(
            name=payload.name,
            slug=payload.slug,
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

        # Check slug uniqueness (exclude self)
        existing = self.db.exec(
            select(Category).where(
                Category.slug == payload.slug,
                Category.id != category_id,
                Category.is_deleted == False,
            )
        ).first()
        if existing:
            raise DefaultException(message="Category slug already exists")

        category.name = payload.name
        category.slug = payload.slug
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
