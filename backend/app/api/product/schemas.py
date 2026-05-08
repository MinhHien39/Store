from datetime import datetime

from pydantic import BaseModel, Field, model_validator

from app.core.api.request import BaseFilterQuery, BaseRequest


class ProductImagePreviewItem(BaseModel):
    id: int
    image_url: str
    sort_order: int
    created_at: datetime
    updated_at: datetime | None = None


class ProductListItem(BaseModel):
    id: int
    category_id: int | None = None
    brand_id: int | None = None
    name: str
    slug: str | None = None
    short_description: str | None = None
    price: int
    sale_price: int | None = None
    stock_quantity: int = 0
    main_image_url: str | None = None
    display_order: int = 0
    status: int = 1
    created_at: datetime
    updated_at: datetime | None = None


class ProductDetailItem(ProductListItem):
    description: str | None = None
    images: list[ProductImagePreviewItem] = Field(default_factory=list)


class ProductListQuery(BaseFilterQuery):
    keyword: str | None = Field(default=None)
    category_id: int | None = Field(default=None)
    brand_id: int | None = Field(default=None)
    min_price: int | None = Field(default=None, ge=0)
    max_price: int | None = Field(default=None, ge=0)
    sort_by: str | None = Field(default=None)
    sort_dir: str | None = Field(default="asc")


class ProductCreateRequest(BaseRequest):
    category_id: int | None = None
    brand_id: int | None = None
    name: str = Field(min_length=1, max_length=255)
    slug: str | None = Field(default=None, max_length=255)
    short_description: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None)
    price: int = Field(..., ge=0)
    sale_price: int | None = Field(default=None, ge=0)
    stock_quantity: int = Field(default=0, ge=0)
    main_image_url: str | None = Field(default=None, max_length=255)
    display_order: int = Field(default=0, ge=0)
    status: int = Field(default=1)

    @model_validator(mode="after")
    def validate_price_logic(self):
        if self.price is not None and self.sale_price is not None and self.sale_price > self.price:
            raise ValueError("sale_price must be less than or equal to price")
        return self


class ProductUpdateRequest(BaseRequest):
    category_id: int | None = None
    brand_id: int | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    slug: str | None = Field(default=None, max_length=255)
    short_description: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None)
    price: int | None = Field(default=None, ge=0)
    sale_price: int | None = Field(default=None, ge=0)
    stock_quantity: int | None = Field(default=None, ge=0)
    main_image_url: str | None = Field(default=None, max_length=255)
    display_order: int | None = Field(default=None, ge=0)
    status: int | None = Field(default=None)

    @model_validator(mode="after")
    def validate_price_logic(self):
        if self.price is not None and self.sale_price is not None and self.sale_price > self.price:
            raise ValueError("sale_price must be less than or equal to price")
        return self


class ProductCsvImportErrorItem(BaseModel):
    row_number: int
    identifier: str | None = None
    message: str


class ProductCsvImportResult(BaseModel):
    total_rows: int = 0
    created_count: int = 0
    updated_count: int = 0
    skipped_count: int = 0
    errors: list[ProductCsvImportErrorItem] = Field(default_factory=list)
