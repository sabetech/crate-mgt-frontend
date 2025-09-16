import { useState } from "react";
import { AutoComplete } from "antd";
import { useGetProducts } from "../../hooks/salesHook";
import { useAuthToken } from "../../../../hooks/auth";
import { IProductWithBalance, IProductWithLoadoutBalance } from "../../../../interfaces/Product";


type ProductSearchPros = {
    onProductSelected: (product: IProductWithBalance) => void
    cachedLoadoutProducts?: IProductWithLoadoutBalance[]
    disabled?: boolean
}

const ProductSearch:React.FC<ProductSearchPros> = ({ cachedLoadoutProducts, onProductSelected, disabled }) => {
    const authToken = useAuthToken()
    
    const {data: products} = cachedLoadoutProducts === undefined ? useGetProducts(authToken) : {data: cachedLoadoutProducts}; //if there is a cachedLoadoutProducts, use it instead
    // const [_internalSelectedProducts, _setSelectedProducts] = useState<IProductWithBalance[]>([]);

    console.log("products: ?????", products)

    const onProductChange = (_: string, option: IProductWithBalance) => {
        if (typeof option === 'undefined') {
            return;
        }
        
        onProductSelected(option)
        // _setSelectedProducts(prev => [...prev, option])
        
    };


    return (
        <AutoComplete 
            allowClear={true}
            // value={"faec"}
            onClear={() => {
                // setUnitPrice(0);
                // setQuantity(1);
                // setSelectedProduct(undefined);
                // form.setFieldValue('unit_price', 0)
            }}
            bordered={true}
            // onSearch={onSearch}
            onSelect={(text: string, option: any) => onProductChange(text, option)}
            placeholder="Search for Product"
            options={products?.map(prdt => ({...prdt, value: `${prdt.sku_name} (${prdt?.inventory_balance?.quantity ?? 0})` })).filter(prdt => (prdt?.inventory_balance?.quantity > 0 ))}
            filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            disabled={disabled}
        />
    )
}

export default ProductSearch