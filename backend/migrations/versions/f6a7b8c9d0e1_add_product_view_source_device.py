"""add source and device columns to product views

Revision ID: f6a7b8c9d0e1
Revises: e5f6a7b8c9d0
Create Date: 2026-05-22 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f6a7b8c9d0e1"
down_revision: Union[str, Sequence[str], None] = "e5f6a7b8c9d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(table_name: str) -> bool:
    return sa.inspect(op.get_bind()).has_table(table_name)


def _column_names(table_name: str) -> set[str]:
    if not _table_exists(table_name):
        return set()
    return {column["name"] for column in sa.inspect(op.get_bind()).get_columns(table_name)}


def _index_names(table_name: str) -> set[str]:
    if not _table_exists(table_name):
        return set()
    return {index["name"] for index in sa.inspect(op.get_bind()).get_indexes(table_name)}


def _add_column_if_missing(column_name: str, column: sa.Column) -> None:
    if column_name not in _column_names("product_views"):
        op.add_column("product_views", column)


def _create_index_if_missing(index_name: str, columns: list[str]) -> None:
    if index_name not in _index_names("product_views"):
        op.create_index(index_name, "product_views", columns, unique=False)


def upgrade() -> None:
    if not _table_exists("product_views"):
        return

    _add_column_if_missing("source", sa.Column("source", sa.String(length=64), nullable=True))
    _add_column_if_missing("device_type", sa.Column("device_type", sa.String(length=32), nullable=True))
    _add_column_if_missing("browser", sa.Column("browser", sa.String(length=64), nullable=True))
    _add_column_if_missing("os", sa.Column("os", sa.String(length=64), nullable=True))
    _add_column_if_missing("timezone", sa.Column("timezone", sa.String(length=64), nullable=True))

    op.execute("UPDATE product_views SET source = 'web' WHERE source IS NULL")

    _create_index_if_missing("ix_product_views_source", ["source"])
    _create_index_if_missing("ix_product_views_device_type", ["device_type"])


def downgrade() -> None:
    if not _table_exists("product_views"):
        return

    existing_indexes = _index_names("product_views")
    if "ix_product_views_device_type" in existing_indexes:
        op.drop_index("ix_product_views_device_type", table_name="product_views")
    if "ix_product_views_source" in existing_indexes:
        op.drop_index("ix_product_views_source", table_name="product_views")

    existing_columns = _column_names("product_views")
    for column_name in ["timezone", "os", "browser", "device_type", "source"]:
        if column_name in existing_columns:
            op.drop_column("product_views", column_name)
