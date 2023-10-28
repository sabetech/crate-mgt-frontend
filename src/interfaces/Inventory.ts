import { IProduct } from "./Product";
import { ICustomer } from "./Customer";

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