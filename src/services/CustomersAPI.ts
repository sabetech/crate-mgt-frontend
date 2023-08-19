import * as api from './API';

import { ICustomer } from '../interfaces/Customer'
import { ServerResponse } from '../interfaces/Server';

export const getCustomers = async (token: string): Promise<ServerResponse<ICustomer[]>> => {
    return (await api.get('/customers', {'Authorization': token})).data;
}

export const getCustomersWithBalance = async (token: string): Promise<ServerResponse<ICustomer[]>> => {
    return (await api.get('/customers?with-balance=true', {'Authorization': token})).data;
}

export const addCustomer = async (values: ICustomer, token: string) => {
    return (await api.post('/customers', values, {'Authorization': token})).data;
}

export const addCustomerReturnEmpties = async (values: any, token: string) => {
    return (await api.post('/customer_empties_returns', values, {'Authorization': token})).data;
}

export const getCustomerHistory = async (id: number, token: string) => {
    return (await api.get(`/customer_history/${id}`, {'Authorization': token})).data;
}
