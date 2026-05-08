from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import SQLModel
from starlette.exceptions import HTTPException as StarletteHTTPException

from app import store  # noqa: F401
from app.api import (
    admin_auth_router,
    auth_router,
    brand_router,
    category_router,
    dashboard_router,
    mock_health_router,
    order_admin_router,
    order_user_router,
    product_image_router,
    product_router,
    store_user_router,
)
from app.core import AppException, ErrorHandler, logger, settings
from app.db.core.session import engine

PREFIX_API_V1 = "/api/v1"
UPLOADS_DIR = Path("/backend/uploads")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up application...")
    SQLModel.metadata.create_all(engine)
    yield
    logger.info("Shutting down application...")


app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
    swagger_ui_parameters={"persistAuthorization": True},
)

origins = settings.CORS_ALLOWED_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mock_health_router, prefix=PREFIX_API_V1)
app.include_router(auth_router, prefix=PREFIX_API_V1)
app.include_router(admin_auth_router, prefix=PREFIX_API_V1)
app.include_router(category_router, prefix=PREFIX_API_V1)
app.include_router(brand_router, prefix=PREFIX_API_V1)
app.include_router(product_router, prefix=PREFIX_API_V1)
app.include_router(product_image_router, prefix=PREFIX_API_V1)
app.include_router(store_user_router, prefix=PREFIX_API_V1)
app.include_router(order_user_router, prefix=PREFIX_API_V1)
app.include_router(order_admin_router, prefix=PREFIX_API_V1)
app.include_router(dashboard_router, prefix=PREFIX_API_V1)

# Serve uploaded files
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.exception_handler(Exception)
@app.exception_handler(HTTPException)
@app.exception_handler(AppException)
@app.exception_handler(RequestValidationError)
@app.exception_handler(StarletteHTTPException)
@app.exception_handler(SQLAlchemyError)
async def global_exception_handler(request: Request, exception: Exception):
    return await ErrorHandler.handle(request, exception)
