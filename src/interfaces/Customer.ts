import { IProduct } from "./Empties";
export interface ICustomer {
    id?: number;
    key?: number;
    name: string;
    phone: string;
    customer_type: string;
    customer_empties_account?: ICustomerReturnEmpties[];
}
export interface ICustomerReturnEmpties {
    date: string,
    customer: ICustomer,
    products: IProduct[],
    number_of_pcs?: number,
    quantity_transacted: number,
    transaction_type: string,
}