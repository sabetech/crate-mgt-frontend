import * as api from './API';
import { IProductWithBalance } from '../interfaces/Product';
import { ServerResponse  } from '../interfaces/Server'
import { IProduct } from '../interfaces/Product';

export const getProducts = async (token: string, option: {is_returnable: boolean}): Promise<ServerResponse<IProduct[]>> => {
   if (option.is_returnable) 
       return (await api.get('/products_returnable', {'Authorization': token})).data;
    return (await api.get('/products-all', {'Authorization': token})).data;
}

export const getProductsWithStockBalance = async (token: string): Promise<ServerResponse<IProductWithBalance[]>> => {
    return (await api.get('/products/balance', {'Authorization': token})).data;
}
