import { useQuery, useMutation } from '@tanstack/react-query';
import { ServerResponse } from '../../../interfaces/Server';
import { IProductWithBalance } from '../../../interfaces/Product';
import { getProductsWithStockBalance } from '../../../services/ProductsAPI';
import { AppError } from '../../../interfaces/Error';
import { pay } from '../../../services/SalesAPI';
import { auth } from '../../../services/API';


// const { data: productsData } = 
export const useGetProducts = (authHeader: any) => {
  
  const { data, isLoading, error } = useQuery<ServerResponse<IProductWithBalance[]>, Error>(
    ['products_all'],
    () => getProductsWithStockBalance(authHeader())
);

    return { data, isLoading, error };  
}

const submitPosOrder = async (authHeader: string, values: any) => {
  const response = await pay(authHeader, values);
  return response
}

export const useSubmitPosOrder = (authHeader: any) => {

  return useMutation(
    {
      mutationFn: (values: any) => submitPosOrder(authHeader(), values),
      onSuccess: (data: any) => {
        console.log(data)
      },
      onError: (error: AppError) => {
        console.log(error)
      }
    }
  )
}

export const useLoadoutPosOrder = (authHeader: any) => {

  return useMutation(
    {
      mutationFn: (values: any) => submitPosOrder(authHeader(), values),
      onSuccess: (data: any) => {
        console.log(data)
      },
      onError: (error: AppError) => {
        console.log(error)
      }
    }
  )
}