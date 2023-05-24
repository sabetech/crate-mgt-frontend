import * as api from './API';
import { ServerResponse  } from '../interfaces/Server'
import { IUser } from '../interfaces/User'


export const signIn = async ({email, password}: IUser): Promise<ServerResponse<IUser | Error>> => {
    return (await api.post('/login', {email, password}, {})).data;
}
