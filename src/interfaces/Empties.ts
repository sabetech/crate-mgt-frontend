export interface ServerResponse<T> {
    data: T;
    success: boolean;
}

export interface IProduct {
    id?: number;
    sku_name: string;
    quantity?: number;
    sku_code?: string;
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
    image_reference: string;
    products: IProduct[];
}