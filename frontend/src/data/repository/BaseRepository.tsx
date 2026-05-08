import {
    ApiService,
    ApiError,
    ApiResult,
    ApiResultType
} from '@/core/api';

class BaseRepository {
    /*
    {
        status_code: 200 / 500
        message: "OK" / "Error Message"
        data: {} / []
    }
    */

    apiService: ApiService;

    constructor() {
        this.apiService = ApiService.getInstance();
    }

    protected async safeCall<T>(fn: () => Promise<T>): Promise<ApiResult<T>> {
        try {
            const data = await fn();
            return {
                type: ApiResultType.Success,
                data: data
            };
        } catch (error) {
            if (error instanceof ApiError) {
                return {
                    type: ApiResultType.Error,
                    error: error
                };
            }
            return {
                type: ApiResultType.Error,
                error: new ApiError(500, (error as Error).message ?? 'Unknown error')
            };
        }
    }
}

export default BaseRepository;