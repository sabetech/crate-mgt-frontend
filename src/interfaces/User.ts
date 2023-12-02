export interface IUser {
    id?: number;
    name?: string;
    email: string;
    password?: string;
    role?: Role | string;
    token?: string;
    token_type?: string;
    expires_at?: string;
}

export type Role = {
    name: string;
    permissions: Permission[];
};

export type Permission = {
    name: string;
    description: string;
}