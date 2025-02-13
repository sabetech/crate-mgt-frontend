export interface IProduct {
    id?: number;
    key?: number;
    sku_name: string;
    sku_code: string;
    retail_price?: number;
    wholesale_price?: number;
    empty_returnable?: boolean;
}

export interface IProductWithBalance {
    id?: number;
    key?: number;
    sku_name: string;
    sku_code: string;
    retail_price?: number;
    wholesale_price?: number;
    empty_returnable?: boolean;
    inventory_balance: IInventoryBalance;
}

export interface IProductWithLoadoutBalance {
    id?: number;
    key?: number;
    sku_name: string;
    sku_code: string;
    retail_price?: number;
    wholesale_price?: number;
    empty_returnable?: boolean;
    inventory_balance: {
        quantity: number;
    }
}

export interface IEmptyOnGroundProducts {
    id?: number;
    key?: number;
    product: IProduct;
    quantity: number;
    is_empty: boolean;
}

export interface IInventoryBalance {
    id?: number;
    key?: number;
    product: IProduct;
    quantity: number;
    breakages: number;
}
export interface IStockProduct {
    id?: number;
    product: IProduct;
    quantity: number;
}

export interface IStock {
    date: string;
    products: IStockProduct[];
    breakages: IStockProduct[];
}

export interface IStockReport {
    id?: number;
    date: string;
    product: IProduct;
    quantity: number;
    breakages: number;
}