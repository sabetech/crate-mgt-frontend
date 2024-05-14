import { IEmptyOnGroundProducts } from "./Product";

export interface IProduct {
    id?: number;
    sku_name: string;
    sku_code?: string;
    pivot?: {
        quantity: number;
    }
    is_empty?: boolean;
}

export interface IEmptyLog {
    id? : number; 
    key?: number;
    date: string;
    quantity_received: number;
    vehicle_number: string;
    purchase_order_number: string;
    received_by: string;
    delivered_by: string;
    pallets_number: number;
    pcs_number?: number;
    image_reference: string;
    approved?: boolean;
    products: IProduct[];
}

export interface IEmptyReturnedLog {
    id?: number;
    date: string;
    quantity: number;
    vehicle_number: string;
    returned_by: string;
    pallets_number: number;
    pcs_number?: number;
    products: IProduct[]
}

export interface IEmptiesInHouseCount {
    id?: number;
    date: string;
    quantity: number;
    empties_on_ground_products: IEmptyOnGroundProducts[];
    pcs_number?: number;
}

export interface IEmptiesBalance {
    product_id: number;
    quantity: number;
    product: {
        sku_name: string
    }
}

export interface IEmptiesTransaction {
    transaction_id: string;
    datetime: string;
    quantity: number;
    product_id: number;
    transaction_type: string;
    activity: string;
    product: {
        sku_name: string
    }
}

//Add Pallets???