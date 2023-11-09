import * as api from './API';

import { ICustomer } from '../interfaces/Customer'
import { ServerResponse } from '../interfaces/Server';

export const getCustomers = async (token: string, {customer_type}: {customer_type?: string} = {}): Promise<ServerResponse<ICustomer[]>> => {
    if (customer_type === 'all')
        return (await api.get('/customers', {'Authorization': token})).data;
    return (await api.get(`/customers?customer_type=${customer_type}`, {'Authorization': token})).data;
}

export const getCustomersWithBalance = async (token: string, {customer_type}: {customer_type?: string} = {}): Promise<ServerResponse<ICustomer[]>> => {
    if (customer_type === 'all') {
        return (await api.get('/customers?with-balance=true', {'Authorization': token})).data;
    }
    return (await api.get(`/customers?with-balance=true&customer_type=${customer_type}`, {'Authorization': token})).data;
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

export const recordVSESales = async (id: number, values: any, token: string) => {
    return (await api.post(`/record_vse_sales/${id}`, values, {'Authorization': token})).data;
}