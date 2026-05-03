export interface IBaseResponse<T> {
    data: T;
    message: string;
    success: boolean;
    errors: string[];
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
        skip?: number;
    };
}

