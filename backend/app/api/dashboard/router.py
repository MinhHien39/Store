from fastapi import Depends, Query

from app.core import SuccessResponse, BaseApiRouter, RequireAdminDep
from .service import DashboardService, get_dashboard_service

router = BaseApiRouter(
    prefix="/admin/dashboard",
    tags=["admin-dashboard"],
    dependencies=[RequireAdminDep],
)


@router.get("/summary")
async def get_summary(
    service: DashboardService = Depends(get_dashboard_service),
):
    data = service.get_summary()
    return SuccessResponse(data=data)


@router.get("/chart")
async def get_chart(
    days: int = Query(default=7, ge=7, le=30),
    service: DashboardService = Depends(get_dashboard_service),
):
    data = service.get_chart(days=days)
    return SuccessResponse(data=data)
