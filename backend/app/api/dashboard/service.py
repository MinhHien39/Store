from datetime import date, timedelta

from sqlmodel import select
from sqlalchemy import func, cast, Date

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

    def get_chart(self, days: int = 7) -> dict:
        """Return orders count and revenue per day for the last `days` days."""
        today = date.today()
        start = today - timedelta(days=days - 1)

        rows = self.db.exec(
            select(
                cast(Order.created_at, Date).label("day"),
                func.count().label("orders"),
                func.coalesce(func.sum(Order.total_amount), 0).label("revenue"),
            )
            .where(
                Order.is_deleted == False,
                cast(Order.created_at, Date) >= start,
            )
            .group_by(cast(Order.created_at, Date))
            .order_by(cast(Order.created_at, Date))
        ).all()

        # Fill every day in range (even days with no orders)
        data_by_day = {str(r.day): {"orders": r.orders, "revenue": float(r.revenue)} for r in rows}
        result = []
        for i in range(days):
            d = str(start + timedelta(days=i))
            result.append({
                "date": d,
                "orders": data_by_day.get(d, {}).get("orders", 0),
                "revenue": data_by_day.get(d, {}).get("revenue", 0.0),
            })
        return {"days": result}


get_dashboard_service = create_service(DashboardService, ReadDbSessionDep)
