import * as api from './API';
import { IProductWithBalance } from '../interfaces/Product';
import { ServerResponse  } from '../interfaces/Server'
import { IProduct } from '../interfaces/Product';

export const getProducts = async (token: string, option: {is_returnable: boolean}): Promise<ServerResponse<IProduct[]>> => {
   if (option.is_returnable) 
       return (await api.get('/products_returnable', {'Authorization': token})).data;
    return (await api.get('/products-all', {'Authorization': token})).data;
}

export const getProductsWithStockBalance = async (token: string): Promise<IProductWithBalance[]> => {
    return (await api.get('/products/balance', {'Authorization': token})).data.data;
}

export const addProduct = async (values: IProduct, token: string): Promise<ServerResponse<string>> => {
    return (await api.post('/products/new/', values, {'Authorization': token})).data;
}

export const deleteProduct = async (id: number, token: string): Promise<ServerResponse<string>> => {
    return (await api.deleteRequest(`/products/${id}`, {'Authorization': token})).data;
}

export const updateProduct = async (id: number, values: IProduct, token: string): Promise<ServerResponse<string>> => {
    return (await api.put(`/products/edit/${id}`, values, {'Authorization': token})).data;
}