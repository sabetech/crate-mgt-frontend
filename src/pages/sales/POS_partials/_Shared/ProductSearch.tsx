import { AutoComplete, FormItemProps } from "antd";
import { useGetProducts } from "../../hooks/salesHook";
import { useAuthHeader } from "react-auth-kit";
import { IProductWithBalance } from "../../../../interfaces/Product";
import { ICustomer, ICustomerReturnEmpties } from "../../../../interfaces/Customer";

type ProductSearchPros = {
    customer: ICustomer
}

const ProductSearch:React.FC<ProductSearchPros> = ({customer}) => {
    const authHeader = useAuthHeader()
    const {data: products} = useGetProducts(authHeader);

    const onProductChange = (_: string, option: IProductWithBalance) => {
        if (typeof option === 'undefined') {
            return;
        }
        
        // setSelectedProduct(option);
        
        if (customer && customer.customer_type === 'wholesaler') {
            // form.setFieldValue("unit_price", option.wholesale_price);
            // setUnitPrice(typeof option.wholesale_price === 'undefined' ? 0 : option.wholesale_price);
        }else{
            // form.setFieldValue("unit_price", option.retail_price);
            // setUnitPrice(typeof option.retail_price === 'undefined' ? 0 : option.retail_price);
        }
        
    };


    return (
        <AutoComplete 
            disabled={typeof customer === 'undefined'}
            allowClear={true}
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