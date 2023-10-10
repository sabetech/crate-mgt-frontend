import * as api from './API';
import { IProduct } from '../interfaces/Product';
import { ServerResponse  } from '../interfaces/Server'

export const getProducts = async (token: string, option: {is_returnable: boolean}): Promise<ServerResponse<IProduct[]>> => {
   if (option.is_returnable) 
       return (await api.get('/products_returnable', {'Authorization': token})).data;
    return (await api.get('/products-all', {'Authorization': token})).data;
}
