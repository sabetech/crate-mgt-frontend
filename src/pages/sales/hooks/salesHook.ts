import { useQuery } from '@tanstack/react-query';
import { ServerResponse } from '../../../interfaces/Server';
import { IProductWithBalance } from '../../../interfaces/Product';
import { getProductsWithStockBalance } from '../../../services/ProductsAPI';


// const { data: productsData } = 
export const useGetProducts = (authHeader: any) => {
  
  const { data, isLoading, error } = useQuery<ServerResponse<IProductWithBalance[]>, Error>(
    ['products_all'],
    () => getProductsWithStockBalance(authHeader())
);

    return { data, isLoading, error };  
}