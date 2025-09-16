import * as api from './API';
import { TUser } from '../types/user'
import { ServerResponse } from '../interfaces/Server';

export const getUsers = async (token: string): Promise<ServerResponse<TUser[]>> => {
  return (await api.get('/users', {'Authorization': token})).data;
}

export const getUser = async (userId: number, token: string): Promise<ServerResponse<TUser>> => {
  return (await api.get(`/users/${userId}`, {'Authorization': token})).data;
}

export const addUser = async (values: TUser, token: string) => {
    return (await api.post('/users', values, {'Authorization': token})).data;
}

export const deleteUser = async (userId: number, token: string) => {
  return (await api.deleteRequest(`/users/${userId}`, {'Authorization': token})).data;
}

export const editUser = async (userId: number, values: TUser, token: string) => {
  return (await api.put(`/users/${userId}`, values, {'Authorization': token})).data;
}

export const getRoles = async (token: string) => {
  return (await api.get('/roles', {'Authorization': token})).data;
}