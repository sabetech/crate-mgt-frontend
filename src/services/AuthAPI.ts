import * as api from './API';
import { TUser } from '../types/user';


export const signIn = async ({email, password}: TUser) => {
    return (await api.post('/login', {email, password}, {}));
}

export const logout = async (token: string) => {
    return (await api.post('/logout', {}, {'Authorization': token}));
}
