export interface ServerResponse<T> {
    data: T;
    success: boolean;
    status?: number;
    message?: string;
}
