export default class ApiError extends Error {
    statusCode: number;
    message: string;
    data?: any;
    errorCode?: string;

    constructor(statusCode: number, message: string, data?: any, errorCode?: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;

        Object.setPrototypeOf(this, ApiError.prototype);
    }
    

    getMessage(): string {
        return this.message
    }
}