from enum import Enum

class StatusCode(int, Enum):
    UNAUTHORIZED: int = 401
    FORBIDDEN: int = 403
    NOT_FOUND: int = 404
    BAD_REQUEST: int = 400
    DATA_NOT_FOUND: int = 400

    # Success.
    OK: int = 200

    # Exception error.
    INTERNAL_ERROR: int = 500

    # No matching record.
    DEFAULT_ERROR: int = 400
