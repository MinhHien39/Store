# app/core/api/error_handler.py
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException, RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from ..api import BaseResponse, ErrorResponse
from ..utils import logger
from . import AppException, ErrorCode, ErrorMessage

class ErrorHandler:

    @staticmethod
    async def handle(request: Request, exc: Exception):
        """
        Centralized error handling
        Handles different types of exceptions and returns a standardized BaseResponse.
        Args:
            request (Request): The incoming request object.
            exc (HTTPException): The exception that was raised.
        Returns:
            JSONResponse: A JSON response with standardized error format.
        """

        # Log Instance name of exc
        logger.debug(f"Exception instance: {type(exc).__name__}")

        # 1️⃣ AppException
        if isinstance(exc, AppException):
            logger.error(f"{request.method} {request.url} -> {exc.detail}")
            return JSONResponse(
                status_code=exc.status_code,
                content=BaseResponse(
                    success=False,
                    message=str(exc.message),
                    error_code=str(exc.error_code),
                ).to_json()
            )

        # 2️⃣ FastAPI HTTPException
        if isinstance(exc, HTTPException):
            logger.error(f"{request.method} {request.url} -> {exc.detail}")
            return JSONResponse(
                status_code=exc.status_code,
                content=BaseResponse(
                    success=False,
                    message=str(exc.detail),
                    error_code=str(exc.status_code),
                ).to_json()
            )

        # 3️⃣ Validation error
        if isinstance(exc, RequestValidationError):
            logger.error(f"{request.method} {request.url} -> validation_error")
            return JSONResponse(
                status_code=422,
                content=ErrorResponse(
                    message=ErrorMessage.VALIDATION,
                    error_code=ErrorCode.VALIDATION,
                    data={"errors": exc.errors()},
                ).to_json()
            )

        # 4️⃣ StarletteHTTPException
        if isinstance(exc, StarletteHTTPException):
            logger.error(f"{request.method} {request.url} -> {exc.detail}")
            return JSONResponse(
                status_code=exc.status_code,
                content=BaseResponse(
                    success=False,
                    message=str(exc.detail),
                    error_code=str(exc.status_code),
                ).to_json()
            )

        #  Unknown / unhandled error
        logger.error(f"Unhandled error {request.method} {request.url}: {exc}")
        return JSONResponse(
            status_code=500,
            content=BaseResponse(
                success=False,
                message=ErrorMessage.INTERNAL,
                error_code=ErrorCode.INTERNAL_ERROR,
            ).to_json()
        )
