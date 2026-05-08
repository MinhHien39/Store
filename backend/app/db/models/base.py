# app/db/base.py
from datetime import datetime
from sqlmodel import SQLModel, Field

from app.core import DateUtils

class BaseDbModel(SQLModel):
    created_at: datetime = Field(default_factory=DateUtils.now, nullable=False)
    created_by: str | None = Field(default=None, nullable=True)
    updated_at: datetime | None = Field(default_factory=DateUtils.now, nullable=True)
    updated_by: str | None = Field(default=None, nullable=True)
    is_deleted: bool = Field(default=False, nullable=False)

    def to_json(self) -> dict:
        return self.model_dump()