import { TUser, TPermission, TRole } from "../types/user";
import { USER, TOKEN, TOKEN_TYPE} from "../utils/constants";
// import { useQuery } from "@tanstack/react-query";
// import * as apiClient from "../services/UsersAPI";


type signInType = {
    token: string,
    user: TUser,
    tokenType: string
}
export const useSignIn = () => {
    
    return ({
        token: token,
        user: user,
        tokenType: tokenType
    }: signInType) => {
        localStorage.setItem(USER, JSON.stringify(user));
        localStorage.setItem(TOKEN, token);
        localStorage.setItem(TOKEN_TYPE, tokenType);

        return true
    };
}

export const useAuthUser = () => {

    return (): TUser => {
        const user = JSON.parse(localStorage.getItem(USER) ?? "{}") as TUser;
        user.hasPermission = (permission: TPermission) => {
            return user.permissions.map((p: TPermission) => p.name).includes(permission.name);
        }
        user.hasRole = (role: TRole) => {
            return user.roles.map((r: TRole) => r.name).includes(role.name);
        }
        return user
    };
}

export const useAuthToken = () => {
    return `Bearer ${localStorage.getItem(TOKEN)}`;
}

export const useSignOut = () => {
    return () => {
        localStorage.removeItem(USER);
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(TOKEN_TYPE);
    }
}

export const useIsAuthenticated = () => {

    const token = localStorage.getItem(TOKEN);
    console.log("token", token)
    if (token === null) {
        return false
    }

    return true
}

// const _getUser = async (email: string, token?: string) => {

//     const { data } = await apiClient.getUser(email)
//     return data.data
// }

// export const useGetUser = (email: string, token: string) => {
//     return  useQuery<TUser>( 
//         { 
//             queryKey: [email],
//             queryFn: async () => {
//                 return await _getUser(email)
//             },
//             enabled: false,
//             retry: 0
//         })
// }

