import { IProduct } from "./Empties";
export interface ICustomer {
    id?: number;
    key?: number;
    name: string;
    phone: string;
    customer_type: string;
}
export interface ICustomeReturnEmpties {
    date: string,
    customer: ICustomer,
    products: IProduct[],
    quantity: number,
    transaction_type: string,
}