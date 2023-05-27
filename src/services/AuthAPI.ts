import * as api from './API';
import { IUser } from '../interfaces/User'


export const signIn = async ({email, password}: IUser) => {
    return (await api.post('/login', {email, password}, {}));
}
