import ApiError from "./ApiError";

export enum ApiResultType {
    Success = 'success',
    Error = 'error'
}

export type ApiResult<T> =
    | { type: ApiResultType.Success; data: T }
    | { type: ApiResultType.Error; error: ApiError };
