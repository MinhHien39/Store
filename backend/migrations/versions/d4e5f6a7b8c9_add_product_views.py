"""add product views

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-05-21 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d4e5f6a7b8c9"
down_revision: Union[str, Sequence[str], None] = "c3d4e5f6a7b8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(table_name: str) -> bool:
    return sa.inspect(op.get_bind()).has_table(table_name)


def _index_names(table_name: str) -> set[str]:
    if not _table_exists(table_name):
        return set()
    return {index["name"] for index in sa.inspect(op.get_bind()).get_indexes(table_name)}


def _create_index_if_missing(index_name: str, columns: list[str]) -> None:
    if index_name not in _index_names("product_views"):
        op.create_index(index_name, "product_views", columns, unique=False)


def upgrade() -> None:
    if not _table_exists("product_views"):
        op.create_table(
            "product_views",
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("created_by", sa.String(length=255), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
            sa.Column("updated_by", sa.String(length=255), nullable=True),
            sa.Column("is_deleted", sa.Boolean(), nullable=False),
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("product_id", sa.Integer(), nullable=False),
            sa.Column("product_name", sa.String(length=255), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=True),
            sa.Column("anonymous_id", sa.String(length=128), nullable=True),
            sa.Column("session_id", sa.String(length=128), nullable=True),
            sa.Column("ip_address", sa.String(length=64), nullable=True),
            sa.Column("user_agent", sa.String(length=500), nullable=True),
            sa.Column("referrer", sa.String(length=500), nullable=True),
            sa.Column("viewed_path", sa.String(length=500), nullable=True),
            sa.Column("locale", sa.String(length=32), nullable=True),
            sa.Column("screen_width", sa.Integer(), nullable=True),
            sa.Column("screen_height", sa.Integer(), nullable=True),
            sa.Column("viewed_at", sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(["product_id"], ["products.id"]),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
            sa.PrimaryKeyConstraint("id"),
        )

    _create_index_if_missing("ix_product_views_product_id", ["product_id"])
    _create_index_if_missing("ix_product_views_product_name", ["product_name"])
    _create_index_if_missing("ix_product_views_user_id", ["user_id"])
    _create_index_if_missing("ix_product_views_anonymous_id", ["anonymous_id"])
    _create_index_if_missing("ix_product_views_session_id", ["session_id"])
    _create_index_if_missing("ix_product_views_ip_address", ["ip_address"])
    _create_index_if_missing("ix_product_views_viewed_at", ["viewed_at"])


def downgrade() -> None:
    if _table_exists("product_views"):
        op.drop_table("product_views")
