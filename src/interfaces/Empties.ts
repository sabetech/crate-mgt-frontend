export interface IProduct {
    id?: number;
    sku_name: string;
    sku_code?: string;
    pivot?: {
        quantity: number;
    }
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
    image_reference: string;
    products: IProduct[];
}

export interface IEmptyReturnedLog {
    id?: number;
    date: string;
    quantity: number;
    vehicle_number: string;
    returned_by: string;
    pallets_number: number;
    products: IProduct[]
}