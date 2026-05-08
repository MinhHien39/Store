"""add category icon

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-05-11 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = "b2c3d4e5f6a7"
down_revision: Union[str, Sequence[str], None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    category_cols = {c["name"] for c in inspector.get_columns("categories")}

    if "icon" not in category_cols:
        op.add_column(
            "categories",
            sa.Column(
                "icon",
                sqlmodel.sql.sqltypes.AutoString(length=50),
                nullable=True,
                server_default="package",
            ),
        )

    op.execute(
        """
        UPDATE categories
        SET icon = CASE slug
            WHEN 'dien-thoai' THEN 'smartphone'
            WHEN 'laptop' THEN 'laptop'
            WHEN 'may-tinh-bang' THEN 'tablet'
            WHEN 'phu-kien' THEN 'cable'
            WHEN 'dong-ho-thong-minh' THEN 'watch'
            WHEN 'tai-nghe' THEN 'headphones'
            WHEN 'camera' THEN 'camera'
            WHEN 'thiet-bi-mang' THEN 'router'
            ELSE COALESCE(icon, 'package')
        END
        WHERE icon IS NULL OR icon = 'package'
        """
    )


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    category_cols = {c["name"] for c in inspector.get_columns("categories")}

    if "icon" in category_cols:
        op.drop_column("categories", "icon")
