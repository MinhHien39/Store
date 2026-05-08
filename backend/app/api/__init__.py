from .admin_auth.router import router as admin_auth_router
from .auth.router import router as auth_router
from .brand.router import router as brand_router
from .category.router import router as category_router
from .mock.router import router as mock_health_router
from .product.router import router as product_router
from .product_image.router import router as product_image_router
from .store_user.router import router as store_user_router
from .order.router import user_router as order_user_router
from .order.router import admin_router as order_admin_router
from .dashboard.router import router as dashboard_router

__all__ = [
    "admin_auth_router",
    "auth_router",
    "brand_router",
    "category_router",
    "mock_health_router",
    "product_router",
    "product_image_router",
    "store_user_router",
    "order_user_router",
    "order_admin_router",
    "dashboard_router",
]
