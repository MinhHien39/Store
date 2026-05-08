class ApiResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    errorCode?: string;

    constructor(data: T, message: string, statusCode: number, errorCode?: string) {
        this.data = data;
        this.message = message;
        this.errorCode = errorCode;   
        this.statusCode = statusCode;
    }
}

export default ApiResponse;