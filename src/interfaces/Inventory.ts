import { IProduct } from "./Product";
import { ICustomer } from "./Customer";

export interface ILoadout{
    id?: number;
    key?: number;
    date: string;
    customer: ICustomer;
    products: {
        product: IProduct;
        quantity: number;
        quantity_sold?: number;
        quanty_returned?: number;
    }[],
}