import { useQuery, useMutation } from '@tanstack/react-query';
import { ServerResponse } from '../../../interfaces/Server';
import { IProductWithBalance, IProductWithLoadoutBalance } from '../../../interfaces/Product';
import { getProductsWithStockBalance } from '../../../services/ProductsAPI';
import { AppError } from '../../../interfaces/Error';
import { getLoadoutSaleItems, pay } from '../../../services/SalesAPI';
import { ICustomer } from '../../../interfaces/Customer';
import { IOrder } from '../../../interfaces/Sale';


// const { data: productsData } = 
export const useGetProducts = (authHeader: any) => {
  
  const { data, isLoading, error } = useQuery<IProductWithBalance[]>(
    ['products_with_balance'],
    () => getProductsWithStockBalance(authHeader())
);

    return { data, isLoading, error };  
}

const submitPosOrder = async (authHeader: string, values: any) => {
  const response = await pay(authHeader, values);
  return response
}

const getVseLoadoutSaleItems = async (authHeader: string, _selectedvse: ICustomer | undefined) => {
   const response = await getLoadoutSaleItems(authHeader, _selectedvse);
  return response.data
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

export const useLoadoutSalePosItems = (authHeader: any, _selectedvse: ICustomer | undefined) => {
  const { data: loadoutSaleItems, refetch } = useQuery<IOrder>({
    queryKey: ['loadout_sale_items'],
    queryFn: () => getVseLoadoutSaleItems(authHeader(), _selectedvse),
    enabled: false, //prevent auto execution ... 
  }
  );

  console.log("LOADOUT SALE ITEMSfsf::", loadoutSaleItems)

  return (
    { data: loadoutSaleItems?.sales, refetch }
  );
}
