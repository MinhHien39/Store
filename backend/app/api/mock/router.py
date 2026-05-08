from fastapi import APIRouter

from app.core.api import SuccessResponse

router = APIRouter(tags=["mock-health"])


@router.get("/get-healthy", response_model=SuccessResponse[dict])
async def get_healthy():
    return SuccessResponse(
        message="Mock API healthy",
        data={"status": "ok"},
    )
