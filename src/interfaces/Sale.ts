import { ICustomer } from "./Customer";
import { IProduct } from "./Product";
import { PosMode } from "../types/TSale";

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
    status: string;
    paymentType: string;
    order_transaction_id?: string;
    transaction_id?: string;
    posMode?: PosMode
}