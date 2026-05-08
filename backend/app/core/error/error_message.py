class ErrorMessage:
    DEFAULT = "An unexpected error has occurred."
    INTERNAL = "Internal server error"
    VALIDATION = "Validation error"

    UNAUTHORIZED = "Access Unauthorized"
    AUTHORIZATION_HEADER_NOT_FOUND = "Authorization Header not found"
    AUTHORIZATION_BEARER_NOT_FOUND = "Authorization Bearer not found"

    TOKEN_IS_EXPIRED = "Token has expired"
    TOKEN_IS_INVALID = "Invalid token"
    TOKEN_NOT_FOUND = "Token情報が存在しません。"
    TOKEN_IS_REVOKED = "Token has been revoked"
    INVALID_INVITATION_TOKEN = "招待リンクが無効または期限切れです"

    USER_ROLE_ID_INVALID = "ユーザの役割IDが無効です。"
    USER_NOT_FOUND = "ユーザー情報が見つかりません。"
    USER_IN_ACTIVE = "ユーザーは無効化されています。"
    USER_ID_EXISTS = "ユーザーIDは既に登録されています。"
    USER_NOT_IN_ACTIVE = "ユーザーは非アクティブ状態です。"
    USER_IS_TEMP_REGISTER = "ユーザーは仮登録状態です。"

    EMAIL_EXISTS = "メールアドレスは既に登録されています。"
    EMAIL_NOT_VALIDATE = "メールはまだ検証されていません。"

    PASSWORD_INCORRECT = "パスワードが正しくありません。"
    REGISTER_ERROR = "登録に失敗しました。"
    DELETE_ID_NOT_EXIST = "削除対象のIDが存在しません。"

    DATA_EXIST = "データは既に登録されています。"
    DATA_NOT_FOUND = "データ情報が存在しません。"
    DATA_UPDATED_BY_OTHER_USER = "他のユーザーによってデータが更新されています。最新の内容を再読み込みしてください。"

    CSV_DECODE_FAILED = "CSVファイルのデコードに失敗しました。"
    CSV_IMPORT_FAILED = "CSVインポートに失敗しました。"
    CSV_BATCH_UPSERT_FAILED = "CSVバッチアップサートに失敗しました。"
    CSV_BATCH_UPSERT_READER_FAILED = "CSVバッチアップサートリーダーに失敗しました。"
    UPLOAD_FILE_ERROR = "ファイルのアップロードに失敗しました。"

    COMPANY_NOT_FOUND = "会社情報が見つかりません。"
    COMPANY_DISABLED = "会社は無効化されています。"
    COMPANY_NAME_INCORRECT = "会社名が正しくありません。"
    COMPANY_NAME_EXISTS = "会社名は既に登録されています。"
    COMPANY_CODE_IS_INCORRECT = "会社コードが正しくありません。"

    PROPERTY_NOT_FOUND = "工事情報が見つかりません。"
    PROPERTY_DISABLED = "工事は無効化されています。"
    PROPERTY_NAME_EXISTS = "工事名は既に登録されています。"
    PROPERTY_KEY_INCORRECT = "工事のキーが正しくありません。"
    PROPERTY_KEY_EXISTS = "工事のキーは既に登録されています。"

    FILE_NOT_FOUND = "ファイルが見つかりません。"