import { useState, useEffect} from "react";
import { Form, AutoComplete, Input, Typography, InputNumber, Space, Button } from "antd";
import { ServerResponse } from "../../../interfaces/Server";
import { ICustomer } from "../../../interfaces/Customer";
import { useQuery } from "@tanstack/react-query";
import { getCustomersWithBalance } from "../../../services/CustomersAPI";
import { useAuthHeader } from "react-auth-kit";
import ProductSearch from "./_Shared/ProductSearch";
import { IProductWithBalance } from "../../../interfaces/Product";
import { ISaleItem } from "../../../interfaces/Sale";

type Props = {
    // selectedProducts: ISaleItem[];
    // setSelectedProducts: (products: ISaleItem[]) => void;
    setTableContent: React.Dispatch<React.SetStateAction<ISaleItem[]>>
    setVseSaleItems: React.Dispatch<React.SetStateAction<ISaleItem[]>>
    setFocusedCustomer: React.Dispatch<React.SetStateAction<(ICustomer | null)[] | undefined>>
}

const VSE_Loadout:React.FC<Props> = ({setTableContent, setVseSaleItems, setFocusedCustomer}) => {
    const authHeader = useAuthHeader();
    const [form] = Form.useForm();
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1); 
    const [selectedProduct, setSelectedProduct] = useState<IProductWithBalance | undefined>();

    const [selectedProducts, setSelectedProducts] = useState<ISaleItem[]>([]);

     const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
                ['customers-vse'],
                () => getCustomersWithBalance(authHeader(), { customer_type: 'retailer-vse'} )
        );

    const onCustomerChange = (text: any, option: ICustomer) => {
        console.log("Text ", text, option)

        setFocusedCustomer((prev) => {
                
            if (!prev) {return [null, option];}
            const updatedArray = [...prev];
            
            updatedArray[1] = option;
            
            return updatedArray;
        });

        // form.setFieldValue("unit_price", selectedProduct?.retail_price);
        // setUnitPrice(typeof selectedProduct?.retail_price === 'undefined' ? 0 : selectedProduct?.retail_price);
    }

    const onCustomerSelectedProduct = (product: IProductWithBalance) => {
        form.setFieldValue("unit_price", product.retail_price);
        setUnitPrice(typeof product.retail_price === 'undefined' ? 0 : product.retail_price);
    
        setSelectedProduct(product);
        form.setFieldValue("product", product.sku_name);
    }
    
    const formClear = () => {
        form.resetFields();
        setUnitPrice(0);
        setQuantity(1);
        setSelectedProduct(undefined);
    }

    const saveVSELoadout = () => {
        if (typeof selectedProduct !== 'undefined') {
            setSelectedProducts((prev) => [...prev, {id: selectedProduct.id, product: selectedProduct, quantity: quantity, key: selectedProduct.id} as ISaleItem]);
        }

        form.resetFields([
            'product', 'unit_price', 'quantity'
,        ]);
        
    }

    useEffect(() => {
        if (selectedProducts) {
            setTableContent(selectedProducts);
            setVseSaleItems(selectedProducts);
        }

    },[selectedProducts])

    return (<>
        <Form
            layout={'horizontal'}
            form={form}
            style={{ padding: "2rem"}}
            labelCol={{ flex: '200px' }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            initialValues={{
                'quantity': 1
            }}
        >  
            <Form.Item
                label={'Select VSE'}
            >
                <AutoComplete 
                    allowClear={true}
                    bordered={true}
                    onSelect={(text: string, option: ICustomer) => onCustomerChange(text, option)}
                    placeholder="Search for VSE"
                    options={ customersResponse?.data.map(custmr => ({...custmr, value: `${custmr.name} (${custmr.customer_type.toUpperCase()})`})) }
                    filterOption={(inputValue, option) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                />
            </Form.Item>
            
            <Form.Item
                label={'Select Product'}
                name={"product"}
            >
                <ProductSearch 
                    onProductSelected={(product) => onCustomerSelectedProduct(product)}
                    
                />
            </Form.Item>
            <hr />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <Form.Item name={"unit_price"} label={`Unit Price: ${typeof unitPrice === 'undefined'? "0.00" : unitPrice} GHC`}>
                    <Input placeholder="Unit Price" value={unitPrice} readOnly/>
                </Form.Item>
                <Form.Item label="Quantity:" name="quantity">
                    <InputNumber min={1} onChange={(val) => setQuantity( val === null ? 1 : val  )}/>
                </Form.Item>
                <Form.Item label="Price">
                    <Typography className="ant-form-text">{(unitPrice * quantity).toFixed(2)} GHC</Typography>
                </Form.Item>
            </div>
            <Space wrap>
                <Button size={"large"} type="primary" onClick={saveVSELoadout} disabled={(typeof selectedProduct === 'undefined') } >Save</Button>
                <Button size={"large"} onClick={() => formClear()}>Clear</Button>
            </Space>
            

        </Form>
    </>)
}

export default VSE_Loadout