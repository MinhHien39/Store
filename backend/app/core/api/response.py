from typing import Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class BaseResponse(BaseModel, Generic[T]):
    success: bool
    data: T | None = None
    message: str = ""
    error_code: str | None = None

    def to_json(self) -> dict:
        return self.model_dump()

class SuccessResponse(BaseResponse[T]):
    success: bool = True
    data: T | None = None
    message: str = "success"
    error_code: str | None = None

class ErrorResponse(BaseResponse[T]):
    success: bool = False
    data: T | None = None
    message: str = "error"
    error_code: str | None = None

class PaginatedContent(BaseModel, Generic[T]):
    items: list[T] = []
    paging: dict | None = None
