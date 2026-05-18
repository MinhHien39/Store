from fastapi import Depends, Response

from app.core import SuccessResponse, BaseApiRouter, RequireAdminDep, AccessTokenDep, RefreshTokenDep
from .schemas import LoginRequest
from .service import AdminAuthService, get_admin_auth_service, get_admin_auth_service_no_token

router = BaseApiRouter(tags=["admin-auth"])


@router.post("/admin/auth/login")
async def admin_login(
    request: LoginRequest,
    response: Response,
    service: AdminAuthService = Depends(get_admin_auth_service_no_token),
):
    data = service.login(request=request, response=response)
    return SuccessResponse(data=data)


@router.post("/admin/auth/logout", dependencies=[RequireAdminDep])
async def admin_logout(
    response: Response,
    access_token: str = AccessTokenDep,
    service: AdminAuthService = Depends(get_admin_auth_service_no_token),
):
    service.logout(response=response, access_token=access_token)
    return SuccessResponse()


@router.get("/admin/auth/me", dependencies=[RequireAdminDep])
async def admin_me(
    service: AdminAuthService = Depends(get_admin_auth_service),
):
    data = service.info()
    return SuccessResponse(data=data)


@router.post("/admin/auth/refresh_token")
async def admin_refresh_token(
    response: Response,
    refresh_token: str | None = RefreshTokenDep,
    service: AdminAuthService = Depends(get_admin_auth_service_no_token),
):
    data = service.refresh_token(response=response, refresh_token=refresh_token)
    return SuccessResponse(data=data)
