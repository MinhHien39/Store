from fastapi import Depends, Response

from app.core import SuccessResponse, BaseApiRouter, AccessTokenDep
from .schemas import RegisterRequest, LoginRequest, ChangePasswordRequest, ForgotPasswordRequest
from .service import AuthService, get_auth_service, get_auth_service_no_token

router = BaseApiRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register(
    request: RegisterRequest,
    service: AuthService = Depends(get_auth_service_no_token),
):
    data = service.register(request=request)
    return SuccessResponse(data=data)


@router.post("/login")
async def login(
    request: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service_no_token),
):
    data = service.login(request=request, response=response)
    return SuccessResponse(data=data)


@router.post("/logout")
async def logout(
    response: Response,
    access_token: str = AccessTokenDep,
    service: AuthService = Depends(get_auth_service_no_token),
):
    service.logout(response=response, access_token=access_token)
    return SuccessResponse()


@router.get("/me")
async def me(service: AuthService = Depends(get_auth_service)):
    data = service.me()
    return SuccessResponse(data=data)


@router.patch("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    service: AuthService = Depends(get_auth_service),
):
    service.change_password(request=request)
    return SuccessResponse()


@router.post("/refresh_token")
async def refresh_token(
    response: Response,
    refresh_token: str | None = Depends(lambda: None),
    service: AuthService = Depends(get_auth_service_no_token),
):
    data = service.refresh_token(response=response, refresh_token=refresh_token)
    return SuccessResponse(data=data)
