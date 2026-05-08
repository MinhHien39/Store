from fastapi import HTTPException
from .error_code import ErrorCode
from .error_message import ErrorMessage
from .status_code import StatusCode

# Application Base Exception
class AppException(HTTPException):
    def __init__(
        self,
        status_code: StatusCode,
        message: str,
        error_code: ErrorCode
    ):
        detail = {
            "errors": [
                message
            ],
        }
        super().__init__(status_code=status_code.value, detail=detail)
        self.message = message
        self.error_code = error_code.value

# Authorization Exceptions
class UnauthorizedException(AppException):
    def __init__(self, message: str = ErrorMessage.UNAUTHORIZED):
        super().__init__(
            status_code=StatusCode.UNAUTHORIZED,
            message=message,
            error_code=ErrorCode.UNAUTHORIZED
        )

# Data Not Found Exception
class DataNotFoundException(AppException):
    def __init__(
        self, 
        message: str = ErrorMessage.DATA_NOT_FOUND, 
        error_code: ErrorCode = ErrorCode.DATA_NOT_FOUND
    ):
        super().__init__(
            status_code=StatusCode.DEFAULT_ERROR,
            message=message,
            error_code=error_code
        )

# S3 Exception
class S3Exception(AppException):
    def __init__(self, message: str = ErrorMessage.UPLOAD_FILE_ERROR):
        super().__init__(
            status_code=StatusCode.INTERNAL_ERROR,
            message=message,
            error_code=ErrorCode.INTERNAL_ERROR
        )

# Default Exception
class DefaultException(AppException):
    def __init__(self, message: str = ErrorMessage.DEFAULT):
        super().__init__(
            status_code=StatusCode.DEFAULT_ERROR,
            message=message,
            error_code=ErrorCode.DEFAULT
        )

# Unknown Exception
class UnknownException(AppException):
    def __init__(self, message: str = ErrorMessage.INTERNAL):
        super().__init__(
            status_code=StatusCode.INTERNAL_ERROR,
            message=message,
            error_code=ErrorCode.INTERNAL_ERROR
        )
# DB Exception
class DBException(AppException):
    def __init__(self, message: str = ErrorMessage.INTERNAL):
        super().__init__(
            status_code=StatusCode.INTERNAL_ERROR,
            message=message,
            error_code=ErrorCode.INTERNAL_ERROR
        )   

        