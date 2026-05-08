"""
Admin Auth API Schemas
"""
from pydantic import BaseModel, Field

from app.core import BaseRequest


class LoginRequest(BaseRequest):
    """Admin login request"""
    email: str = Field(
        ...,
        min_length=3,
        max_length=150,
        examples=["admin1@gmail.com"]
    )
    password: str = Field(
        ...,
        min_length=3,
        max_length=255,
        examples=["123456"]
    )
