import * as api from './API';
import { ServerResponse } from '../interfaces/Server';
import { IOrder } from '../interfaces/Sale';

export const pay = async (token: string, values: IOrder): Promise<ServerResponse<string>> => {

    const serverValues = Object.assign({}, values, { customer: values.customer.id });

    return (await api.post('/sales/pay', serverValues, {'Authorization': token})).data;
}

export const getOrders = async (token: string): Promise<ServerResponse<IOrder[]>> => {
    return (await api.get('/sales', {'Authorization': token})).data;
}