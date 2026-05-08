from fastapi import Depends

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
