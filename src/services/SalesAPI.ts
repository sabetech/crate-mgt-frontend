import * as api from './API';
import { ServerResponse } from '../interfaces/Server';
import { IOrder } from '../interfaces/Sale';
import { TSaleReport } from '../types/TSaleReport';
import { ICustomer } from '../interfaces/Customer';

export const pay = async (token: string, values: IOrder): Promise<ServerResponse<string>> => {
    console.log("VALUES::", values);
    const serverValues = Object.assign({}, values, { customer: values.customer.id });
    
    if (values.order_transaction_id) {
        await printReceipt(values);
    }

    return (await api.post('/sales/pay', serverValues, {'Authorization': token})).data;
}

export const printReceipt = async(values: IOrder): Promise<any> => {
    console.log("ORDER DETAILS::",values)
    return (await api.print(values)).data;
}

export const getOrders = async (token: string): Promise<ServerResponse<IOrder[]>> => {
    return (await api.get('/sales', {'Authorization': token})).data;
}

export const getDailySalesReport = async (token: string, dateRange: string[], customerOption: string): Promise<ServerResponse<TSaleReport[]>> => {

    if (dateRange.length < 1) return new Promise((_, reject) => reject(new Error('Input is not valid')));
    if (dateRange[0] == '') return new Promise((_, reject) => reject(new Error('Input is not valid')));

    return (await api.get(`/sales/daily-report?from=${dateRange[0]}&to=${dateRange[1]}&customerOption=${customerOption}`, {'Authorization': token})).data;
}

export const getLoadoutSaleItems = async (token: string, customer: ICustomer | undefined): Promise<ServerResponse<IOrder>> => {

    if (customer === undefined) {
        return new Promise((_, reject) => reject(new Error('Input is not valid')));
    }

    return (await api.get(`/sales/loadout/vse/${customer.id}`, {'Authorization': token})).data;
}