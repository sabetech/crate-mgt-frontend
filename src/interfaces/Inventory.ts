import { IProduct } from "./Product";
import { ICustomer } from "./Customer";
import { ISaleItem } from "./Sale";

export interface ILoadout{
    id?: number;
    key?: number;
    date: string;
    vse: ICustomer;
    products: {
        product: IProduct;
        quantity: number;
        quantity_sold?: number;
        quanty_returned?: number;
    }[],
}

export interface ILoadoutInfo {
    id?: number;
    key?: number;
    date: string;
    product: IProduct;
    quantity: number;
    quantity_sold?: number;
    quanty_returned?: number;
    vse_outstandingbalance?: number;
}

export interface ISaleOrder {
    id?: number;
    key?: number;
    customer: ICustomer;
    sales: ISaleItem[];
    transaction_id: string;
}
export interface IInventoryOrder {
    id?: number;
    key?: number;
    date: string;
    order_id: string;
    order: ISaleOrder;
}

