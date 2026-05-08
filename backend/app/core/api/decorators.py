import functools
import time
from fastapi import HTTPException
from .response import BaseResponse
from ..error import AppException, ErrorCode, ErrorMessage
from ..utils import logger

def safe_call(func):
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        logger.info(f"[START API] {func.__name__}")

        try:
            return BaseResponse(
                success=True,
                data=await func(*args, **kwargs)
            )
        except AppException as e:
            logger.error(e.detail)
            return BaseResponse(
                success=False,
                message=str(e.detail),
                error_code=str(e.error_code)
            )
        except HTTPException as e:
            logger.error(e.detail)
            return BaseResponse(
                success=False,
                message=str(e.detail),
                error_code=str(e.status_code)
            )
        except Exception as e:
            logger.error(e)
            return BaseResponse(
                success=False,
                message=ErrorMessage.INTERNAL,
                error_code=ErrorCode.INTERNAL_ERROR.value
            )
        finally:
            end_time = time.time()
            elapsed_time = (end_time - start_time) * 1000  # in milliseconds
            logger.info(f"[END API] {func.__name__} - Time taken: {elapsed_time:.2f}ms")
    return wrapper
