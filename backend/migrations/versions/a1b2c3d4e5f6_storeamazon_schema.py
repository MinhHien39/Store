"""storeamazon schema

Revision ID: a1b2c3d4e5f6
Revises: 3e819ceb0a22
Create Date: 2026-04-28 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '3e819ceb0a22'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Patch admins table: drop old Iretoru columns, add phone ──────────
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    admin_cols = {c['name'] for c in inspector.get_columns('admins')}

    if 'phone' not in admin_cols:
        op.add_column('admins', sa.Column('phone', sqlmodel.sql.sqltypes.AutoString(length=20), nullable=True))
    for old_col in ('furigana', 'phone_number', 'postal_code', 'address'):
        if old_col in admin_cols:
            op.drop_column('admins', old_col)

    # ── Create new StoreAmazon tables (skip if already exist) ────────────
    existing_tables = set(inspector.get_table_names())

    if 'users' not in existing_tables:
        op.create_table(
            'users',
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('created_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.Column('updated_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('is_deleted', sa.Boolean(), nullable=False),
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('email', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
            sa.Column('password', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
            sa.Column('full_name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
            sa.Column('phone', sqlmodel.sql.sqltypes.AutoString(length=20), nullable=True),
            sa.Column('status', sa.Integer(), nullable=True),
            sa.Column('role_id', sa.Integer(), nullable=False, server_default='2'),
            sa.PrimaryKeyConstraint('id'),
        )
        op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
        op.create_index(op.f('ix_users_full_name'), 'users', ['full_name'], unique=False)

    if 'categories' not in existing_tables:
        op.create_table(
            'categories',
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('created_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.Column('updated_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('is_deleted', sa.Boolean(), nullable=False),
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
            sa.Column('slug', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
            sa.Column('description', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
            sa.Column('image_url', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
            sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
            sa.Column('status', sa.Integer(), nullable=False, server_default='1'),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('slug'),
        )
        op.create_index(op.f('ix_categories_name'), 'categories', ['name'], unique=False)

    if 'brands' not in existing_tables:
        op.create_table(
            'brands',
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('created_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.Column('updated_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('is_deleted', sa.Boolean(), nullable=False),
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
            sa.Column('slug', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
            sa.Column('description', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
            sa.Column('logo_url', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
            sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
            sa.Column('status', sa.Integer(), nullable=False, server_default='1'),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('slug'),
        )
        op.create_index(op.f('ix_brands_name'), 'brands', ['name'], unique=False)

    if 'products' not in existing_tables:
        op.create_table(
            'products',
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('created_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.Column('updated_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('is_deleted', sa.Boolean(), nullable=False),
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('category_id', sa.Integer(), sa.ForeignKey('categories.id'), nullable=True),
            sa.Column('brand_id', sa.Integer(), sa.ForeignKey('brands.id'), nullable=True),
            sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
            sa.Column('slug', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
            sa.Column('short_description', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('price', sa.Integer(), nullable=False),
            sa.Column('sale_price', sa.Integer(), nullable=True),
            sa.Column('stock_quantity', sa.Integer(), nullable=False, server_default='0'),
            sa.Column('main_image_url', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
            sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
            sa.Column('status', sa.Integer(), nullable=False, server_default='1'),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('slug'),
        )
        op.create_index(op.f('ix_products_name'), 'products', ['name'], unique=False)

    if 'product_images' not in existing_tables:
        op.create_table(
            'product_images',
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('created_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.Column('updated_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('is_deleted', sa.Boolean(), nullable=False),
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('product_id', sa.Integer(), sa.ForeignKey('products.id'), nullable=False),
            sa.Column('image_url', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
            sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
            sa.PrimaryKeyConstraint('id'),
        )

    if 'orders' not in existing_tables:
        op.create_table(
            'orders',
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('created_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.Column('updated_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('is_deleted', sa.Boolean(), nullable=False),
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
            sa.Column('status', sa.Integer(), nullable=False, server_default='1'),
            sa.Column('total_amount', sa.Integer(), nullable=False),
            sa.Column('shipping_name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
            sa.Column('shipping_phone', sqlmodel.sql.sqltypes.AutoString(length=20), nullable=True),
            sa.Column('shipping_address', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
            sa.Column('notes', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
            sa.PrimaryKeyConstraint('id'),
        )

    if 'order_items' not in existing_tables:
        op.create_table(
            'order_items',
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('created_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.Column('updated_by', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
            sa.Column('is_deleted', sa.Boolean(), nullable=False),
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('order_id', sa.Integer(), sa.ForeignKey('orders.id'), nullable=False),
            sa.Column('product_id', sa.Integer(), sa.ForeignKey('products.id'), nullable=False),
            sa.Column('quantity', sa.Integer(), nullable=False),
            sa.Column('price', sa.Integer(), nullable=False),
            sa.PrimaryKeyConstraint('id'),
        )


def downgrade() -> None:
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('product_images')
    op.drop_table('products')
    op.drop_table('brands')
    op.drop_table('categories')
    op.drop_table('users')
    # Restore admins columns (best-effort)
    op.add_column('admins', sa.Column('phone_number', sqlmodel.sql.sqltypes.AutoString(length=20), nullable=True))
    op.drop_column('admins', 'phone')
