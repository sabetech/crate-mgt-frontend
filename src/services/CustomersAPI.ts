import * as api from './API';

import { ICustomer } from '../interfaces/Customer'

export const getCustomers = async (token: string): Promise<ICustomer[]> => {
    return (await api.get('/customers', {'Authorization': token})).data;
}

export const addCustomer = async (values: ICustomer, token: string): Promise<string> => {
    return (await api.post('/customers', values, {'Authorization': token})).data;
}

