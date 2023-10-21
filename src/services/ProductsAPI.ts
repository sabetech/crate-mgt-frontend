import * as api from './API';
import { IProduct } from '../interfaces/Product';
import { ServerResponse  } from '../interfaces/Server'
import { IStock } from '../interfaces/Product';

export const getProducts = async (token: string, option: {is_returnable: boolean}): Promise<ServerResponse<IProduct[]>> => {
   if (option.is_returnable) 
       return (await api.get('/products_returnable', {'Authorization': token})).data;
    return (await api.get('/products-all', {'Authorization': token})).data;
}

export const takeStock = async (token: string, values: IStock): Promise<ServerResponse<string>> => {
    return (await api.post('/stocks/take-stock', values, {'Authorization': token})).data;
}

export const getStock = async (token: string, date: string) => {
    console.log(date);
    return (await api.get('/stocks/get-stock?date='+date, {'Authorization': token})).data
}