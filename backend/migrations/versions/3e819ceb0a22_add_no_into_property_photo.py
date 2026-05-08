"""add no into property_photo

Revision ID: 3e819ceb0a22
Revises: 62e075a3acb4
Create Date: 2026-04-07 15:03:21.834528

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '3e819ceb0a22'
down_revision: Union[str, Sequence[str], None] = '62e075a3acb4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('property_photos', sa.Column('no', sa.Integer(), nullable=True))

    # Composite index for fast shift queries: UPDATE ... WHERE company_id=? AND property_id=? AND no > ?
    op.create_index(
        'ix_property_photos_company_property_no',
        'property_photos',
        ['company_id', 'property_id', 'no'],
    )

    # Populate existing rows: assign sequential no based on sort_order order within each property
    op.execute("""
        UPDATE property_photos p
        JOIN (
            SELECT id, company_id, property_id,
                   ROW_NUMBER() OVER (
                       PARTITION BY company_id, property_id
                       ORDER BY sort_order ASC, id ASC
                   ) AS rn
            FROM property_photos
            WHERE is_deleted = FALSE
        ) r
          ON p.id = r.id
         AND p.company_id = r.company_id
         AND p.property_id = r.property_id
        SET p.no = r.rn
        WHERE p.is_deleted = FALSE
    """)

    # Drop sort_order column — ordering is now handled by `no`
    op.drop_column('property_photos', 'sort_order')


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('property_photos', sa.Column('sort_order', sa.Numeric(), nullable=True))
    op.drop_index('ix_property_photos_company_property_no', table_name='property_photos')
    op.drop_column('property_photos', 'no')
