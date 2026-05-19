"""add supplement category

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-05-19 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c3d4e5f6a7b8"
down_revision: Union[str, Sequence[str], None] = "b2c3d4e5f6a7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            INSERT INTO categories
                (name, slug, icon, description, image_url, display_order, status, created_at, created_by, updated_at, updated_by, is_deleted)
            SELECT
                'Thực Phẩm Bổ Sung',
                'thuc-pham-bo-sung',
                'pill',
                'Vitamin, omega 3 và thực phẩm bổ sung',
                NULL,
                9,
                1,
                NOW(),
                'migration',
                NOW(),
                NULL,
                0
            WHERE NOT EXISTS (
                SELECT 1 FROM categories WHERE slug = 'thuc-pham-bo-sung'
            )
            """
        )
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            """
            UPDATE categories
            SET is_deleted = 1, updated_at = NOW(), updated_by = 'migration'
            WHERE slug = 'thuc-pham-bo-sung'
            """
        )
    )
