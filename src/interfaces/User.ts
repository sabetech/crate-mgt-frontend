export interface IUser {
    id?: number;
    name?: string;
    email: string;
    password?: string;
    role?: string;
    token?: string;
    token_type?: string;
    expires_at?: string;
}