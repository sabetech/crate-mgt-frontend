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
    returned?: number;
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

export interface IInventoryReceivableRequest {
    date: string;
    purchase_order_id: string;
    products: {
        product: number,
        quantity: number
    }[],
    breakages: number;
    vehicle_number: string;
    received_by: string;
    delivered_by: string;
    pallets_number: number;
    pcs_number?: number;
    image_ref: string;
    quantity: number;

}

export interface IInventoryReceivable {
    id?: number;
    key?: number;
    date: string;
    puchase_order_id: string;
    product: IProduct;
    quantity: number;
    breakages: number;
}

export interface IReturnsFromVSERequest {
    date: string;
    vse: number;
    products: {
        product: number,
        quantity: number
    }[],
}

export interface IInventoryTransaction {
    date: string;
    time: string;
    product: IProduct;
    action: string;
    comment: string;
    quantity: number;
    balance: number;
}
