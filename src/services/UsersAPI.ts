import * as api from './API';
import { IUser } from '../interfaces/User'
import { ServerResponse } from '../interfaces/Server';

export const getUsers = async (token: string): Promise<ServerResponse<IUser[]>> => {
  return (await api.get('/users', {'Authorization': token})).data;
}