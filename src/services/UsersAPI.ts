import * as api from './API';
import { IUser } from '../interfaces/User'
import { ServerResponse } from '../interfaces/Server';

export const getUsers = async (token: string): Promise<ServerResponse<IUser[]>> => {
  return (await api.get('/users', {'Authorization': token})).data;
}

export const addUser = async (values: IUser, token: string) => {
    return (await api.post('/users', values, {'Authorization': token})).data;
}

export const deleteUser = async (userId: number, token: string) => {
  return (await api.deleteRequest(`/users/${userId}`, {'Authorization': token})).data;
}

export const editUser = async (userId: number, values: IUser, token: string) => {
  return (await api.put(`/users/${userId}`, values, {'Authorization': token})).data;
}

export const getRoles = async (token: string) => {
  return (await api.get('/roles', {'Authorization': token})).data;
}