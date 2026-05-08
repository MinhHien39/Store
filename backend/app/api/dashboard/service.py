from sqlmodel import select
from sqlalchemy import func

from app.core import (
    BaseService,
    create_service,
)
from app.db import (
    ReadDbSessionDep,
    Order,
    Product,
    StoreUser,
)


class DashboardService(BaseService):

    def get_summary(self) -> dict:
        # Total revenue (delivered orders only)
        total_revenue = self.db.exec(
            select(func.coalesce(func.sum(Order.total_amount), 0)).where(
                Order.is_deleted == False,
                Order.status == 4,  # delivered
            )
        ).first() or 0

        # Total orders
        total_orders = self.db.exec(
            select(func.count()).select_from(Order).where(Order.is_deleted == False)
        ).first() or 0

        # Pending orders
        pending_orders = self.db.exec(
            select(func.count()).select_from(Order).where(
                Order.is_deleted == False,
                Order.status == 1,
            )
        ).first() or 0

        # Total products
        total_products = self.db.exec(
            select(func.count()).select_from(Product).where(
                Product.is_deleted == False,
                Product.status == 1,
            )
        ).first() or 0

        # Total users
        total_users = self.db.exec(
            select(func.count()).select_from(StoreUser).where(StoreUser.is_deleted == False)
        ).first() or 0

        return {
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "total_products": total_products,
            "total_users": total_users,
        }


get_dashboard_service = create_service(DashboardService, ReadDbSessionDep)
