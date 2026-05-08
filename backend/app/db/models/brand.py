from sqlmodel import Field

from .base import BaseDbModel


class Brand(BaseDbModel, table=True):
    __tablename__ = "brands"

    id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    name: str = Field(max_length=255, nullable=False, index=True)
    slug: str = Field(max_length=255, nullable=False, unique=True)
    description: str | None = Field(default=None, max_length=500, nullable=True)
    logo_url: str | None = Field(default=None, max_length=255, nullable=True)
    display_order: int = Field(default=0, nullable=False)
    status: int = Field(default=1, nullable=False)
