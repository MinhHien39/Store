from enum import Enum

class ErrorCode(str, Enum):
    # Common
    FORBIDDEN = "403"
    NOT_FOUND = "404"
    BAD_REQUEST = "400"
    INTERNAL_ERROR = "500"
    DEFAULT = "400"
    VALIDATION = "422"
    DATA_NOT_FOUND = "400"

    # Authentication
    UNAUTHORIZED = "401"
    INVALID_CREDENTIALS = "AUTH_001"
    TOKEN_EXPIRED = "AUTH_002"
    TOKEN_INVALID = "AUTH_003"
    TOKEN_REVOKED = "AUTH_004"

    # User
    USER_EXISTS = "USER_001"
    USER_NOT_FOUND = "USER_002"
    USER_IN_ACTIVE = "USER_003"
    USER_IS_TEMP_REGISTER = "USER_004"
    
