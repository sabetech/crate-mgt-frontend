export interface AppError{
    response: {
        data: {
            message: string;
        }
    }
    message: string;
}