import { AutoComplete, FormItemProps } from "antd";
import { useGetProducts } from "../../hooks/salesHook";
import { useAuthHeader } from "react-auth-kit";
import { IProductWithBalance } from "../../../../interfaces/Product";
import { ICustomer, ICustomerReturnEmpties } from "../../../../interfaces/Customer";

type ProductSearchPros = {
    onProductSelected: (product: IProductWithBalance) => void
}

    const ProductSearch:React.FC<ProductSearchPros> = ({ onProductSelected}) => {
    const authHeader = useAuthHeader()
    const {data: products} = useGetProducts(authHeader);

    const onProductChange = (_: string, option: IProductWithBalance) => {
        if (typeof option === 'undefined') {
            return;
        }
        
        onProductSelected(option)
        
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
            options={products?.data.map(prdt => ({...prdt, value: `${prdt.sku_name} (${prdt?.inventory_balance?.quantity ?? 0})` })).filter(prdt => prdt?.inventory_balance?.quantity > 0)}
            filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        />
    )
}

export default ProductSearch