from enum import Enum

class StatusCode(int, Enum):
    UNAUTHORIZED: int = 401
    FORBIDDEN: int = 403
    NOT_FOUND: int = 404
    BAD_REQUEST: int = 400
    DATA_NOT_FOUND: int = 400

    # 正常処理
    OK: int = 200

    # 例外エラー
    INTERNAL_ERROR: int = 500

    # レコードがヒットしない場合
    DEFAULT_ERROR: int = 400