import csv
import io
import re
import unicodedata

from fastapi import Request, UploadFile
from sqlmodel import col, select
from sqlalchemy import String, case, cast, func

from app.core import BaseService, create_service, DataNotFoundException, DefaultException, PagingHelper, PaginatedContent, RequireStoreUserDep, UserRole
from app.core.auth.token import TokenService
from app.db import Brand, Category, Product, ProductImage, ProductReview, ProductView, ReadDbSessionDep, StoreUser, WriteDbSessionDep

from .schemas import (
    ProductCreateRequest,
    ProductCsvImportErrorItem,
    ProductCsvImportResult,
    ProductDetailItem,
    ProductImagePreviewItem,
    ProductListItem,
    ProductListQuery,
    ProductUpdateRequest,
    ProductReviewCreateRequest,
    ProductReviewItem,
    ProductReviewListQuery,
    ProductReviewListResponse,
    ProductReviewSummary,
    ProductReviewUpdateStatusRequest,
    ProductViewStatsItem,
    ProductViewStatsQuery,
    ProductViewTrackRequest,
)


class ProductService(BaseService):
    JPY_TO_VND_RATE = 167.08

    @staticmethod
    def _slugify(value: str) -> str:
        normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
        slug = re.sub(r"[^a-zA-Z0-9]+", "-", normalized.lower()).strip("-")
        return slug or "product"

    @staticmethod
    def _clean_text(value: str | None) -> str | None:
        if value is None:
            return None

        cleaned = str(value).strip()
        return cleaned or None

    def _parse_int(self, value: str | None, field_name: str, row_number: int, required: bool = False) -> int | None:
        cleaned = self._clean_text(value)

        if cleaned is None:
            if required:
                raise DefaultException(message=f"Row {row_number}: {field_name} is required")
            return None

        try:
            return int(float(cleaned))
        except ValueError as exc:
            raise DefaultException(message=f"Row {row_number}: {field_name} must be a number") from exc

    def _parse_price_vnd(self, row: dict[str, str | None], field_name: str, row_number: int, required: bool = False) -> int | None:
        parsed = self._parse_int(row.get(field_name), field_name, row_number, required=False)
        if parsed is not None:
            return parsed

        jpy_key = f"source_{field_name}_jpy"
        parsed_jpy = self._parse_int(row.get(jpy_key), jpy_key, row_number, required=False)
        if parsed_jpy is not None:
            return int(round((parsed_jpy * self.JPY_TO_VND_RATE) / 1000) * 1000)

        if required:
            raise DefaultException(message=f"Row {row_number}: {field_name} is required")

        return None

    def _parse_image_urls(self, value: str | None) -> list[str]:
        cleaned = self._clean_text(value)
        if cleaned is None:
            return []

        urls: list[str] = []
        for raw_url in re.split(r"[\n|;]+", cleaned):
            url = self._clean_text(raw_url)
            if url and url not in urls:
                urls.append(url)

        return urls

    @staticmethod
    def _resolve_client_ip(request: Request) -> str | None:
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()[:64]

        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip[:64]

        if request.client and request.client.host:
            return request.client.host[:64]

        return None

    @staticmethod
    def _resolve_optional_user_id(request: Request) -> int | None:
        authorization = request.headers.get("authorization")
        if not authorization:
            return None

        scheme, _, token = authorization.partition(" ")
        if scheme.lower() != "bearer" or not token:
            return None

        try:
            payload = TokenService.execute(token)
            if payload and payload.get("role_id") == UserRole.STORE_USER.value:
                return payload.get("user_id")
        except Exception:
            return None

        return None

    def _build_category_maps(self) -> tuple[dict[int, Category], dict[str, Category], dict[str, Category]]:
        categories = self.db.exec(
            select(Category).where(Category.is_deleted == False)
        ).all()

        return (
            {category.id: category for category in categories if category.id is not None},
            {category.slug.lower(): category for category in categories if category.slug},
            {category.name.lower(): category for category in categories if category.name},
        )

    def _build_brand_maps(self) -> tuple[dict[int, Brand], dict[str, Brand], dict[str, Brand]]:
        brands = self.db.exec(
            select(Brand).where(Brand.is_deleted == False)
        ).all()

        return (
            {brand.id: brand for brand in brands if brand.id is not None},
            {brand.slug.lower(): brand for brand in brands if brand.slug},
            {brand.name.lower(): brand for brand in brands if brand.name},
        )

    def _resolve_relation_id(
        self,
        row: dict[str, str | None],
        row_number: int,
        label: str,
        id_key: str,
        slug_key: str,
        name_key: str,
        by_id: dict[int, object],
        by_slug: dict[str, object],
        by_name: dict[str, object],
    ) -> int | None:
        relation_id = self._clean_text(row.get(id_key))
        relation_slug = self._clean_text(row.get(slug_key))
        relation_name = self._clean_text(row.get(name_key))

        if relation_id is not None:
            parsed_id = self._parse_int(relation_id, id_key, row_number, required=True)
            relation = by_id.get(parsed_id)
            if not relation:
                raise DefaultException(message=f"Row {row_number}: {label} not found by {id_key}")
            return parsed_id

        if relation_slug is not None:
            relation = by_slug.get(relation_slug.lower())
            if not relation:
                raise DefaultException(message=f"Row {row_number}: {label} not found by {slug_key}")
            return relation.id

        if relation_name is not None:
            relation = by_name.get(relation_name.lower())
            if not relation:
                raise DefaultException(message=f"Row {row_number}: {label} not found by {name_key}")
            return relation.id

        return None

    def _to_item(self, product: Product) -> ProductListItem:
        return ProductListItem(
            id=product.id,
            category_id=product.category_id,
            brand_id=product.brand_id,
            name=product.name,
            slug=product.slug,
            short_description=product.short_description,
            price=product.price,
            sale_price=product.sale_price,
            stock_quantity=product.stock_quantity,
            main_image_url=product.main_image_url,
            display_order=product.display_order,
            status=product.status,
            created_at=product.created_at,
            updated_at=product.updated_at,
        )

    def get_list(self, query: ProductListQuery) -> PaginatedContent:
        where_sql = [Product.is_deleted == False, Product.status == 1]

        if query.keyword:
            where_sql.append(col(Product.name).contains(query.keyword))

        if query.category_id is not None:
            where_sql.append(Product.category_id == query.category_id)

        if query.brand_id is not None:
            where_sql.append(Product.brand_id == query.brand_id)

        if query.min_price is not None:
            where_sql.append(Product.price >= query.min_price)

        if query.max_price is not None:
            where_sql.append(Product.price <= query.max_price)

        # Count total
        total_count = self.db.exec(
            select(func.count()).select_from(Product).where(*where_sql)
        ).first() or 0

        # Build query
        stmt = select(Product).where(*where_sql)

        # Sorting
        if query.sort_by == "price":
            stmt = stmt.order_by(Product.price.asc() if query.sort_dir == "asc" else Product.price.desc())
        elif query.sort_by == "name":
            stmt = stmt.order_by(Product.name.asc() if query.sort_dir == "asc" else Product.name.desc())
        elif query.sort_by == "created_at":
            stmt = stmt.order_by(Product.created_at.desc())
        else:
            stmt = stmt.order_by(Product.display_order.asc(), Product.id.desc())

        offset, limit = query.get_offset_limit()
        stmt = stmt.offset(offset).limit(limit)

        products = self.db.exec(stmt).all()
        items = [self._to_item(p) for p in products]
        paging = PagingHelper(query.page, query.per_page, total_count).create_meta()

        return PaginatedContent(items=items, paging=paging)

    def admin_get_list(self, query: ProductListQuery) -> PaginatedContent:
        """Admin list — includes all statuses"""
        where_sql = [Product.is_deleted == False]

        if query.keyword:
            where_sql.append(col(Product.name).contains(query.keyword))

        if query.category_id is not None:
            where_sql.append(Product.category_id == query.category_id)

        if query.brand_id is not None:
            where_sql.append(Product.brand_id == query.brand_id)

        if query.min_price is not None:
            where_sql.append(Product.price >= query.min_price)

        if query.max_price is not None:
            where_sql.append(Product.price <= query.max_price)

        total_count = self.db.exec(
            select(func.count()).select_from(Product).where(*where_sql)
        ).first() or 0

        stmt = select(Product).where(*where_sql)

        if query.sort_by == "price":
            stmt = stmt.order_by(Product.price.asc() if query.sort_dir == "asc" else Product.price.desc())
        elif query.sort_by == "name":
            stmt = stmt.order_by(Product.name.asc() if query.sort_dir == "asc" else Product.name.desc())
        elif query.sort_by == "created_at":
            stmt = stmt.order_by(Product.created_at.desc())
        else:
            stmt = stmt.order_by(Product.display_order.asc(), Product.id.desc())

        offset, limit = query.get_offset_limit()
        stmt = stmt.offset(offset).limit(limit)

        products = self.db.exec(stmt).all()
        items = [self._to_item(p) for p in products]
        paging = PagingHelper(query.page, query.per_page, total_count).create_meta()

        return PaginatedContent(items=items, paging=paging)

    def get(self, product_id: int) -> ProductDetailItem:
        product = self.db.exec(
            select(Product).where(Product.id == product_id, Product.is_deleted == False, Product.status == 1)
        ).first()
        if not product:
            raise DataNotFoundException(message="Product not found")

        images = self.db.exec(
            select(ProductImage)
            .where(ProductImage.product_id == product.id, ProductImage.is_deleted == False)
            .order_by(ProductImage.sort_order.asc(), ProductImage.id.asc())
        ).all()

        return ProductDetailItem(
            **self._to_item(product).model_dump(),
            description=product.description,
            images=[
                ProductImagePreviewItem(
                    id=img.id,
                    image_url=img.image_url,
                    sort_order=img.sort_order,
                    created_at=img.created_at,
                    updated_at=img.updated_at,
                )
                for img in images
            ],
        )

    def get_by_slug(self, slug: str) -> ProductDetailItem:
        product = self.db.exec(
            select(Product).where(Product.slug == slug, Product.is_deleted == False, Product.status == 1)
        ).first()
        if not product:
            raise DataNotFoundException(message="Product not found")

        images = self.db.exec(
            select(ProductImage)
            .where(ProductImage.product_id == product.id, ProductImage.is_deleted == False)
            .order_by(ProductImage.sort_order.asc(), ProductImage.id.asc())
        ).all()

        return ProductDetailItem(
            **self._to_item(product).model_dump(),
            description=product.description,
            images=[
                ProductImagePreviewItem(
                    id=img.id,
                    image_url=img.image_url,
                    sort_order=img.sort_order,
                    created_at=img.created_at,
                    updated_at=img.updated_at,
                )
                for img in images
            ],
        )

    def admin_get(self, product_id: int) -> ProductDetailItem:
        product = self.db.exec(
            select(Product).where(Product.id == product_id, Product.is_deleted == False)
        ).first()
        if not product:
            raise DataNotFoundException(message="Product not found")

        images = self.db.exec(
            select(ProductImage)
            .where(ProductImage.product_id == product.id, ProductImage.is_deleted == False)
            .order_by(ProductImage.sort_order.asc(), ProductImage.id.asc())
        ).all()

        return ProductDetailItem(
            **self._to_item(product).model_dump(),
            description=product.description,
            images=[
                ProductImagePreviewItem(
                    id=img.id,
                    image_url=img.image_url,
                    sort_order=img.sort_order,
                    created_at=img.created_at,
                    updated_at=img.updated_at,
                )
                for img in images
            ],
        )

    def track_view(
        self,
        product_id: int,
        payload: ProductViewTrackRequest | None,
        request: Request,
    ) -> dict:
        product = self.db.exec(
            select(Product).where(
                Product.id == product_id,
                Product.is_deleted == False,
                Product.status == 1,
            )
        ).first()
        if not product:
            raise DataNotFoundException(message="Product not found")

        payload = payload or ProductViewTrackRequest()
        view = ProductView(
            product_id=product.id,
            product_name=product.name,
            user_id=self._resolve_optional_user_id(request),
            anonymous_id=payload.anonymous_id,
            session_id=payload.session_id,
            ip_address=self._resolve_client_ip(request),
            user_agent=(request.headers.get("user-agent") or None),
            referrer=(request.headers.get("referer") or None),
            viewed_path=payload.viewed_path,
            locale=payload.locale,
            screen_width=payload.screen_width,
            screen_height=payload.screen_height,
            created_by="product-view-tracker",
        )
        self.db.add(view)
        self.db.flush()

        return {"tracked": True, "product_id": product.id}

    def admin_get_view_stats(self, query: ProductViewStatsQuery) -> PaginatedContent:
        where_sql = [ProductView.is_deleted == False]

        if query.product_id is not None:
            where_sql.append(ProductView.product_id == query.product_id)

        if query.keyword:
            where_sql.append(col(ProductView.product_name).contains(query.keyword))

        visitor_key = func.coalesce(
            cast(ProductView.user_id, String),
            ProductView.anonymous_id,
            ProductView.session_id,
            ProductView.ip_address,
        )

        grouped = (
            select(
                ProductView.product_id.label("product_id"),
                func.max(ProductView.product_name).label("product_name"),
                func.count(ProductView.id).label("total_views"),
                func.coalesce(func.sum(case((ProductView.user_id.is_not(None), 1), else_=0)), 0).label("authenticated_views"),
                func.coalesce(func.sum(case((ProductView.user_id.is_(None), 1), else_=0)), 0).label("anonymous_views"),
                func.count(func.distinct(visitor_key)).label("unique_visitors"),
                func.max(ProductView.viewed_at).label("latest_viewed_at"),
            )
            .where(*where_sql)
            .group_by(ProductView.product_id)
        ).subquery()

        total_count = self.db.exec(select(func.count()).select_from(grouped)).first() or 0
        offset, limit = query.get_offset_limit()

        rows = self.db.execute(
            select(grouped)
            .order_by(grouped.c.total_views.desc(), grouped.c.latest_viewed_at.desc())
            .offset(offset)
            .limit(limit)
        ).all()

        items = [
            ProductViewStatsItem(
                product_id=row._mapping["product_id"],
                product_name=row._mapping["product_name"],
                total_views=row._mapping["total_views"],
                authenticated_views=row._mapping["authenticated_views"],
                anonymous_views=row._mapping["anonymous_views"],
                unique_visitors=row._mapping["unique_visitors"],
                latest_viewed_at=row._mapping["latest_viewed_at"],
            )
            for row in rows
        ]
        paging = PagingHelper(query.page, query.per_page, total_count).create_meta()

        return PaginatedContent(items=items, paging=paging)

    def get_reviews(self, product_id: int, query: ProductReviewListQuery) -> ProductReviewListResponse:
        product = self.db.exec(
            select(Product).where(
                Product.id == product_id,
                Product.is_deleted == False,
                Product.status == 1,
            )
        ).first()
        if not product:
            raise DataNotFoundException(message="Product not found")

        where_sql = [
            ProductReview.product_id == product_id,
            ProductReview.is_deleted == False,
            ProductReview.status == 1,
        ]
        if query.keyword:
            where_sql.append(col(ProductReview.comment).contains(query.keyword))

        total_count = self.db.exec(
            select(func.count()).select_from(ProductReview).where(*where_sql)
        ).first() or 0
        offset, limit = query.get_offset_limit()
        reviews = self.db.exec(
            select(ProductReview)
            .where(*where_sql)
            .order_by(ProductReview.created_at.desc(), ProductReview.id.desc())
            .offset(offset)
            .limit(limit)
        ).all()

        paging = PagingHelper(query.page, query.per_page, total_count).create_meta()
        return ProductReviewListResponse(
            summary=self._build_review_summary(product_id),
            items=[self._review_to_item(review) for review in reviews],
            paging=paging,
        )

    def admin_get_reviews(self, query: ProductReviewListQuery) -> PaginatedContent:
        where_sql = [ProductReview.is_deleted == False]

        if query.product_id is not None:
            where_sql.append(ProductReview.product_id == query.product_id)

        if query.status is not None:
            where_sql.append(ProductReview.status == query.status)

        if query.keyword:
            where_sql.append(
                col(ProductReview.product_name).contains(query.keyword)
                | col(ProductReview.user_name).contains(query.keyword)
                | col(ProductReview.comment).contains(query.keyword)
            )

        total_count = self.db.exec(
            select(func.count()).select_from(ProductReview).where(*where_sql)
        ).first() or 0
        offset, limit = query.get_offset_limit()
        reviews = self.db.exec(
            select(ProductReview)
            .where(*where_sql)
            .order_by(ProductReview.created_at.desc(), ProductReview.id.desc())
            .offset(offset)
            .limit(limit)
        ).all()

        paging = PagingHelper(query.page, query.per_page, total_count).create_meta()
        return PaginatedContent(items=[self._review_to_item(review) for review in reviews], paging=paging)

    def create_or_update_review(self, product_id: int, payload: ProductReviewCreateRequest) -> ProductReviewItem:
        product = self.db.exec(
            select(Product).where(
                Product.id == product_id,
                Product.is_deleted == False,
                Product.status == 1,
            )
        ).first()
        if not product:
            raise DataNotFoundException(message="Product not found")

        user = self.db.exec(
            select(StoreUser).where(
                StoreUser.id == self.token_payload.user_id,
                StoreUser.is_deleted == False,
            )
        ).first()
        if not user:
            raise DataNotFoundException(message="User not found")

        review = self.db.exec(
            select(ProductReview).where(
                ProductReview.product_id == product_id,
                ProductReview.user_id == user.id,
                ProductReview.is_deleted == False,
            )
        ).first()

        comment = self._clean_text(payload.comment)
        user_name = user.full_name or user.email
        if review:
            review.product_name = product.name
            review.user_name = user_name
            review.rating = payload.rating
            review.comment = comment
            review.status = 1
            review.updated_by = self.updated_by
            review.updated_at = self.updated_at
            self.db.add(review)
        else:
            review = ProductReview(
                product_id=product.id,
                product_name=product.name,
                user_id=user.id,
                user_name=user_name,
                rating=payload.rating,
                comment=comment,
                status=1,
                created_by=self.created_by,
            )
            self.db.add(review)

        self.db.flush()
        self.db.refresh(review)
        return self._review_to_item(review)

    def update_review_status(self, review_id: int, payload: ProductReviewUpdateStatusRequest) -> ProductReviewItem:
        review = self.db.exec(
            select(ProductReview).where(
                ProductReview.id == review_id,
                ProductReview.is_deleted == False,
            )
        ).first()
        if not review:
            raise DataNotFoundException(message="Review not found")

        review.status = payload.status
        review.updated_by = self.updated_by
        review.updated_at = self.updated_at
        self.db.add(review)
        self.db.flush()
        self.db.refresh(review)
        return self._review_to_item(review)

    def delete_review(self, review_id: int) -> dict:
        review = self.db.exec(
            select(ProductReview).where(
                ProductReview.id == review_id,
                ProductReview.is_deleted == False,
            )
        ).first()
        if not review:
            raise DataNotFoundException(message="Review not found")

        review.is_deleted = True
        review.updated_by = self.updated_by
        review.updated_at = self.updated_at
        self.db.add(review)
        self.db.flush()
        return {"id": review_id}

    def _build_review_summary(self, product_id: int) -> ProductReviewSummary:
        rows = self.db.exec(
            select(ProductReview.rating, func.count(ProductReview.id))
            .where(
                ProductReview.product_id == product_id,
                ProductReview.is_deleted == False,
                ProductReview.status == 1,
            )
            .group_by(ProductReview.rating)
        ).all()
        rating_counts = {rating: count for rating, count in rows}
        total_reviews = sum(rating_counts.values())
        weighted_total = sum(rating * count for rating, count in rating_counts.items())
        average_rating = round(weighted_total / total_reviews, 1) if total_reviews else 0
        return ProductReviewSummary(
            product_id=product_id,
            average_rating=average_rating,
            total_reviews=total_reviews,
            rating_counts={rating: rating_counts.get(rating, 0) for rating in range(1, 6)},
        )

    @staticmethod
    def _review_to_item(review: ProductReview) -> ProductReviewItem:
        return ProductReviewItem(
            id=review.id,
            product_id=review.product_id,
            product_name=review.product_name,
            user_id=review.user_id,
            user_name=review.user_name,
            rating=review.rating,
            comment=review.comment,
            status=review.status,
            created_at=review.created_at,
            updated_at=review.updated_at,
        )

    def create(self, payload: ProductCreateRequest) -> ProductListItem:
        if payload.slug:
            existing = self.db.exec(
                select(Product).where(Product.slug == payload.slug, Product.is_deleted == False)
            ).first()
            if existing:
                raise DefaultException(message="Product slug already exists")

        product = Product(
            category_id=payload.category_id,
            brand_id=payload.brand_id,
            name=payload.name,
            slug=payload.slug,
            short_description=payload.short_description,
            description=payload.description,
            price=payload.price,
            sale_price=payload.sale_price,
            stock_quantity=payload.stock_quantity,
            main_image_url=payload.main_image_url,
            display_order=payload.display_order,
            status=payload.status,
            created_by=self.created_by,
        )
        self.db.add(product)
        self.db.flush()
        self.db.refresh(product)
        return self._to_item(product)

    def update(self, product_id: int, payload: ProductUpdateRequest) -> ProductListItem:
        product = self.db.exec(
            select(Product).where(Product.id == product_id, Product.is_deleted == False)
        ).first()
        if not product:
            raise DataNotFoundException(message="Product not found")

        update_data = payload.model_dump(exclude_unset=True)

        if update_data.get("sale_price") is not None and update_data.get("price") is None:
            if product.price is not None and update_data["sale_price"] > product.price:
                raise DefaultException(message="sale_price must be less than or equal to price")

        if "slug" in update_data and update_data["slug"]:
            existing = self.db.exec(
                select(Product).where(
                    Product.slug == update_data["slug"],
                    Product.id != product_id,
                    Product.is_deleted == False,
                )
            ).first()
            if existing:
                raise DefaultException(message="Product slug already exists")

        for key, value in update_data.items():
            setattr(product, key, value)

        product.updated_by = self.updated_by
        product.updated_at = self.updated_at
        self.db.add(product)
        self.db.flush()
        self.db.refresh(product)
        return self._to_item(product)

    def delete(self, product_id: int) -> dict:
        product = self.db.exec(
            select(Product).where(Product.id == product_id, Product.is_deleted == False)
        ).first()
        if not product:
            raise DataNotFoundException(message="Product not found")

        # Soft delete product images
        images = self.db.exec(
            select(ProductImage).where(
                ProductImage.product_id == product.id,
                ProductImage.is_deleted == False,
            )
        ).all()
        for img in images:
            img.is_deleted = True
            self.db.add(img)

        product.is_deleted = True
        product.updated_by = self.updated_by
        product.updated_at = self.updated_at
        self.db.add(product)
        return {"id": product_id}

    def import_csv(self, file: UploadFile) -> ProductCsvImportResult:
        if not file.filename or not file.filename.lower().endswith(".csv"):
            raise DefaultException(message="Only CSV files are supported")

        content = file.file.read()
        if not content:
            raise DefaultException(message="CSV file is empty")

        try:
            decoded = content.decode("utf-8-sig")
        except UnicodeDecodeError as exc:
            raise DefaultException(message="CSV file could not be decoded with UTF-8") from exc

        reader = csv.DictReader(io.StringIO(decoded))
        if not reader.fieldnames:
            raise DefaultException(message="CSV header row is required")

        category_by_id, category_by_slug, category_by_name = self._build_category_maps()
        brand_by_id, brand_by_slug, brand_by_name = self._build_brand_maps()

        existing_products = self.db.exec(
            select(Product).where(Product.is_deleted == False)
        ).all()
        product_by_id = {product.id: product for product in existing_products if product.id is not None}
        product_by_slug = {product.slug.lower(): product for product in existing_products if product.slug}

        result = ProductCsvImportResult()

        for row_number, raw_row in enumerate(reader, start=2):
            row = {key: self._clean_text(value) for key, value in raw_row.items()}

            if not any(row.values()):
                continue

            result.total_rows += 1

            try:
                name = row.get("name")
                if not name:
                    raise DefaultException(message=f"Row {row_number}: name is required")

                price = self._parse_price_vnd(row, "price", row_number, required=True)
                sale_price = self._parse_price_vnd(row, "sale_price", row_number)
                stock_quantity = self._parse_int(row.get("stock_quantity"), "stock_quantity", row_number) or 0
                display_order = self._parse_int(row.get("display_order"), "display_order", row_number) or 0
                status = self._parse_int(row.get("status"), "status", row_number) or 1

                if sale_price is not None and price is not None and sale_price > price:
                    raise DefaultException(message=f"Row {row_number}: sale_price must be less than or equal to price")

                category_id = self._resolve_relation_id(
                    row=row,
                    row_number=row_number,
                    label="Category",
                    id_key="category_id",
                    slug_key="category_slug",
                    name_key="category_name",
                    by_id=category_by_id,
                    by_slug=category_by_slug,
                    by_name=category_by_name,
                )
                brand_id = self._resolve_relation_id(
                    row=row,
                    row_number=row_number,
                    label="Brand",
                    id_key="brand_id",
                    slug_key="brand_slug",
                    name_key="brand_name",
                    by_id=brand_by_id,
                    by_slug=brand_by_slug,
                    by_name=brand_by_name,
                )

                row_id = self._parse_int(row.get("id"), "id", row_number) if row.get("id") else None
                slug = row.get("slug") or self._slugify(name)

                existing_product = None
                if row_id is not None:
                    existing_product = product_by_id.get(row_id)
                    if not existing_product:
                        raise DefaultException(message=f"Row {row_number}: product not found by id")
                elif slug:
                    existing_product = product_by_slug.get(slug.lower())

                duplicate_product = product_by_slug.get(slug.lower())
                if duplicate_product and existing_product and duplicate_product.id != existing_product.id:
                    raise DefaultException(message=f"Row {row_number}: slug already belongs to another product")
                if duplicate_product and not existing_product:
                    existing_product = duplicate_product

                payload = {
                    "category_id": category_id,
                    "brand_id": brand_id,
                    "name": name,
                    "slug": slug,
                    "short_description": row.get("short_description"),
                    "description": row.get("description"),
                    "price": price,
                    "sale_price": sale_price,
                    "stock_quantity": stock_quantity,
                    "main_image_url": row.get("main_image_url"),
                    "display_order": display_order,
                    "status": status,
                }

                if existing_product:
                    for key, value in payload.items():
                        setattr(existing_product, key, value)
                    existing_product.updated_by = self.updated_by
                    existing_product.updated_at = self.updated_at
                    self.db.add(existing_product)
                    self.db.flush()
                    product_by_id[existing_product.id] = existing_product
                    product_by_slug[slug.lower()] = existing_product
                    product_id = existing_product.id
                    result.updated_count += 1
                else:
                    new_product = Product(
                        **payload,
                        created_by=self.created_by,
                    )
                    self.db.add(new_product)
                    self.db.flush()
                    self.db.refresh(new_product)
                    product_by_id[new_product.id] = new_product
                    if new_product.slug:
                        product_by_slug[new_product.slug.lower()] = new_product
                    product_id = new_product.id
                    result.created_count += 1

                additional_image_urls = self._parse_image_urls(row.get("additional_image_urls"))
                if product_id is not None and additional_image_urls:
                    current_images = self.db.exec(
                        select(ProductImage).where(
                            ProductImage.product_id == product_id,
                            ProductImage.is_deleted == False,
                        )
                    ).all()
                    for image in current_images:
                        image.is_deleted = True
                        image.updated_by = self.updated_by
                        image.updated_at = self.updated_at
                        self.db.add(image)

                    for sort_order, image_url in enumerate(additional_image_urls, start=1):
                        self.db.add(
                            ProductImage(
                                product_id=product_id,
                                image_url=image_url,
                                sort_order=sort_order,
                                created_by=self.created_by,
                            )
                        )

            except DefaultException as exc:
                result.skipped_count += 1
                result.errors.append(
                    ProductCsvImportErrorItem(
                        row_number=row_number,
                        identifier=row.get("name") or row.get("slug") or row.get("id"),
                        message=str(exc.message),
                    )
                )

        return result


get_product_read_service = create_service(ProductService, ReadDbSessionDep)
get_product_write_service = create_service(ProductService, WriteDbSessionDep)
get_product_user_write_service = create_service(ProductService, WriteDbSessionDep, RequireStoreUserDep)
