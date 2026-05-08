from fastapi import APIRouter, Depends
from sqlmodel import Session, text

from app.core.api import SuccessResponse
from app.db import ReadDbSessionDep

router = APIRouter(tags=["mock-health"])


@router.get("/get-healthy", response_model=SuccessResponse[dict])
async def get_healthy(db: Session = ReadDbSessionDep):
    try:
        db.exec(text("SELECT 1"))
        db_status = "ok"
    except Exception:
        db_status = "error"

    return SuccessResponse(
        message="API healthy",
        data={"status": "ok", "db": db_status},
    )
