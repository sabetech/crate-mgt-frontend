import * as api from './API';
import { IProduct } from '../interfaces/Product';
import { ServerResponse  } from '../interfaces/Server'

export const getProducts = async (token: string): Promise<ServerResponse<IProduct[]>> => {
    return (await api.get('/products_returnable', {'Authorization': token})).data;
}
