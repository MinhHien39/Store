"""add product reviews

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-05-21 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e5f6a7b8c9d0"
down_revision: Union[str, Sequence[str], None] = "d4e5f6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(table_name: str) -> bool:
    return sa.inspect(op.get_bind()).has_table(table_name)


def _index_names(table_name: str) -> set[str]:
    if not _table_exists(table_name):
        return set()
    return {index["name"] for index in sa.inspect(op.get_bind()).get_indexes(table_name)}


def _create_index_if_missing(index_name: str, columns: list[str]) -> None:
    if index_name not in _index_names("product_reviews"):
        op.create_index(index_name, "product_reviews", columns, unique=False)


def upgrade() -> None:
    if not _table_exists("product_reviews"):
        op.create_table(
            "product_reviews",
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("created_by", sa.String(length=255), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
            sa.Column("updated_by", sa.String(length=255), nullable=True),
            sa.Column("is_deleted", sa.Boolean(), nullable=False),
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("product_id", sa.Integer(), nullable=False),
            sa.Column("product_name", sa.String(length=255), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("user_name", sa.String(length=255), nullable=True),
            sa.Column("rating", sa.Integer(), nullable=False),
            sa.Column("comment", sa.Text(), nullable=True),
            sa.Column("status", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(["product_id"], ["products.id"]),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("product_id", "user_id", name="uq_product_reviews_product_user"),
        )

    _create_index_if_missing("ix_product_reviews_product_id", ["product_id"])
    _create_index_if_missing("ix_product_reviews_product_name", ["product_name"])
    _create_index_if_missing("ix_product_reviews_user_id", ["user_id"])
    _create_index_if_missing("ix_product_reviews_rating", ["rating"])
    _create_index_if_missing("ix_product_reviews_status", ["status"])


def downgrade() -> None:
    if _table_exists("product_reviews"):
        op.drop_table("product_reviews")
