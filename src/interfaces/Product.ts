export interface IProduct {
    id?: number;
    key?: number;
    sku_name: string;
    sku_code: string;
}

export interface IEmptyOnGroundProducts {
    id?: number;
    key?: number;
    product: IProduct;
    quantity: number;
    is_empty: boolean;

}