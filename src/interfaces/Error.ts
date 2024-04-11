export interface AppError{
    response: {
        data: {
            data: [];
            message: string;
        }
    }
    message: string;
}