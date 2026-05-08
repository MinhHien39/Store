import AxiosClient from './AxiosClient';
import ApiError from './ApiError';
import ApiResponse from './ApiResponse';

const axios = AxiosClient.getInstance();

class ApiService {
    private static _instance: ApiService;

    private constructor() { }

    public static getInstance(): ApiService {
        if (!this._instance) {
            this._instance = new ApiService();
        }
        return this._instance;
    }

    private processApi<T>(
        response: ApiResponse<T>,
        transformCallback?: (data: any) => T
    ): T {
        if (response.statusCode > 200) {
            throw new ApiError(
                response.statusCode,
                response.message ?? 'An error occurred'
            );
        }

        const data = response.data;
        if (transformCallback) {
            try {
                return transformCallback(data);
            } catch (e) {
                throw new ApiError(200, `Error parsing JSON: ${e}`);
            }
        }
        return data;
    }

    /* ================= GET ================= */
    public async get<T>(
        path: string,
        params: object,
        transformCallback?: (data: any) => T
    ): Promise<T> {
        const res = await axios.get<ApiResponse<T>>(path, { params });
        return this.processApi(res.data, transformCallback);
    }

    /* ================= POST JSON ================= */
    public async post<T>(
        path: string,
        body: object,
        transformCallback?: (data: any) => T
    ): Promise<T> {
        const res = await axios.post<ApiResponse<T>>(path, body, {
            headers: { 'Content-Type': 'application/json' },
        });
        return this.processApi(res.data, transformCallback);
    }

    /* ================= POST FORM URL ================= */
    public async postFormUrl<T>(
        path: string,
        body: object,
        transformCallback?: (data: any) => T
    ): Promise<T> {
        const res = await axios.post<ApiResponse<T>>(
            path,
            new URLSearchParams({ ...body }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return this.processApi(res.data, transformCallback);
    }

    /* ================= POST FORM DATA ================= */
    public async postFormData<T>(
        path: string,
        body: FormData,
        transformCallback?: (data: any) => T
    ): Promise<T> {
        const res = await axios.post<ApiResponse<T>>(path, body);
        return this.processApi(res.data, transformCallback);
    }

    public async put<T>(
        path: string,
        body: object,
        transformCallback?: (data: any) => T
    ): Promise<T> {
        const res = await axios.put<ApiResponse<T>>(path, body, {
            headers: { 'Content-Type': 'application/json' },
        });

        return this.processApi(res.data, transformCallback);
    }

    public async patch<T>(
        path: string,
        body: object,
        transformCallback?: (data: any) => T
    ): Promise<T> {
        const res = await axios.patch<ApiResponse<T>>(path, body, {
            headers: { 'Content-Type': 'application/json' },
        });

        return this.processApi(res.data, transformCallback);
    }

    public async delete<T>(
        path: string,
        body?: object,
        transformCallback?: (data: any) => T
    ): Promise<T> {
        const res = await axios.delete<ApiResponse<T>>(path, {
            data: body,
            headers: { 'Content-Type': 'application/json' },
        });

        return this.processApi(res.data, transformCallback);
    }

    /* ================= DOWNLOAD ================= */
    public async downloadFile(
        path: string,
        params: object
    ): Promise<{ blob: Blob; fileName: string | null }> {
        const res = await axios.get(path, {
            params,
            responseType: 'blob',
            headers: {
                'Content-Type': 'text/csv',
            },
        });

        const contentDisposition =
            res.headers['content-disposition'];

        let fileName: string | null = null;

        if (contentDisposition) {
            const utf8Match =
                contentDisposition.match(/filename\*\=UTF-8''(.+)/i);
            if (utf8Match) {
                fileName = decodeURIComponent(utf8Match[1]);
            } else {
                const asciiMatch =
                    contentDisposition.match(/filename="?([^"]+)"?/i);
                if (asciiMatch) {
                    fileName = asciiMatch[1];
                }
            }
        }

        return {
            blob: res.data,
            fileName,
        };
    }
}

export default ApiService;
