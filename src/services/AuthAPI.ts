import * as api from './API';
import { IUser } from '../interfaces/UserManager'


export const signIn = async ({email, password}: IUser) => {
    return (await api.post('/login', {email, password}, {}));
}

export const logout = async (token: string) => {
    return (await api.post('/logout', {}, {'Authorization': token}));
}
