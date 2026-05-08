from pydantic import Field
from app.core import BaseRequest


class RegisterRequest(BaseRequest):
    full_name: str = Field(..., min_length=2, max_length=100, examples=["Nguyễn Văn A"])
    email: str = Field(..., min_length=4, max_length=150, examples=["user@gmail.com"])
    password: str = Field(..., min_length=6, max_length=255, examples=["User123456"])
    phone: str | None = Field(default=None, max_length=20, examples=["0901234567"])


class LoginRequest(BaseRequest):
    email: str = Field(..., min_length=4, max_length=150, examples=["user@gmail.com"])
    password: str = Field(..., min_length=6, max_length=255, examples=["User123456"])


class ChangePasswordRequest(BaseRequest):
    old_password: str = Field(..., min_length=6, max_length=255, examples=["OldPass123"])
    new_password: str = Field(..., min_length=6, max_length=255, examples=["NewPass123"])


class ForgotPasswordRequest(BaseRequest):
    email: str = Field(..., min_length=4, max_length=255, examples=["user@gmail.com"])
