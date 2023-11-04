import { ICustomer } from "./Customer";
import { IProduct } from "./Product";

export interface ISaleItem {
    id?: number;
    key?: number;
    product: IProduct;
    quantity: number;
}

export interface IOrder {
    id?: number;
    saleItems: ISaleItem[];
    total: number;
    amountTendered: number;
    balance: number;
    customer: ICustomer;
    date: string;
    paymentType: string;
}