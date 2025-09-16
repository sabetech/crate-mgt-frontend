import { TUser } from '../types/user';
// export type IUser = {
//     id?: number;
//     name?: string;
//     email: string;
//     password?: string;
//     role?: string;
//     roles?: Role[];
//     token?: string;
//     token_type?: string;
//     expires_at?: string;
//     can?: (permission: string) => boolean;
// };

export type Role = {
    name: string;
    permissions: Permission[];
};

export type Permission = {
    name: string;
    // description: string; -- TO Added later
}

export interface IUserManager {
    user: TUser | null;
    storeUser(user: TUser): void;
}