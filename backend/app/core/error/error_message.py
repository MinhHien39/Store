class ErrorMessage:
    DEFAULT = "An unexpected error has occurred."
    INTERNAL = "Internal server error"
    VALIDATION = "Validation error"

    UNAUTHORIZED = "Access Unauthorized"
    AUTHORIZATION_HEADER_NOT_FOUND = "Authorization Header not found"
    AUTHORIZATION_BEARER_NOT_FOUND = "Authorization Bearer not found"

    TOKEN_IS_EXPIRED = "Token has expired"
    TOKEN_IS_INVALID = "Invalid token"
    TOKEN_NOT_FOUND = "Token not found"
    TOKEN_IS_REVOKED = "Token has been revoked"
    INVALID_INVITATION_TOKEN = "Invitation link is invalid or expired"

    USER_ROLE_ID_INVALID = "User role is invalid"
    USER_NOT_FOUND = "User not found"
    USER_IN_ACTIVE = "User is disabled"
    USER_ID_EXISTS = "User ID already exists"
    USER_NOT_IN_ACTIVE = "User is inactive"
    USER_IS_TEMP_REGISTER = "User is temporarily registered"

    EMAIL_EXISTS = "Email address already exists"
    EMAIL_NOT_VALIDATE = "Email has not been verified"

    PASSWORD_INCORRECT = "Incorrect password"
    REGISTER_ERROR = "Registration failed"
    DELETE_ID_NOT_EXIST = "The target ID does not exist"

    DATA_EXIST = "Data already exists"
    DATA_NOT_FOUND = "Data not found"
    DATA_UPDATED_BY_OTHER_USER = "This data was updated by another user. Please reload the latest version."

    CSV_DECODE_FAILED = "Failed to decode CSV file"
    CSV_IMPORT_FAILED = "CSV import failed"
    CSV_BATCH_UPSERT_FAILED = "CSV batch upsert failed"
    CSV_BATCH_UPSERT_READER_FAILED = "CSV batch upsert reader failed"
    UPLOAD_FILE_ERROR = "File upload failed"

    COMPANY_NOT_FOUND = "Company not found"
    COMPANY_DISABLED = "Company is disabled"
    COMPANY_NAME_INCORRECT = "Company name is incorrect"
    COMPANY_NAME_EXISTS = "Company name already exists"
    COMPANY_CODE_IS_INCORRECT = "Company code is incorrect"

    PROPERTY_NOT_FOUND = "Property not found"
    PROPERTY_DISABLED = "Property is disabled"
    PROPERTY_NAME_EXISTS = "Property name already exists"
    PROPERTY_KEY_INCORRECT = "Property key is incorrect"
    PROPERTY_KEY_EXISTS = "Property key already exists"

    FILE_NOT_FOUND = "File not found"
