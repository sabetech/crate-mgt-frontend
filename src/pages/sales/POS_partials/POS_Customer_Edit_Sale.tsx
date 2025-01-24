import { useEffect, useState } from 'react';
import {Form, AutoComplete, Input, Button, InputNumber, Typography, Space } from 'antd';
import { ICustomer } from '../../../interfaces/Customer';
import { IProductWithBalance } from '../../../interfaces/Product'
import { useQuery } from '@tanstack/react-query'
import { ServerResponse } from '../../../interfaces/Server';
import { getCustomersWithBalance } from '../../../services/CustomersAPI';
import { useAuthHeader } from 'react-auth-kit';
import ProductSearch from "./_Shared/ProductSearch";
import { ISaleItem } from '../../../interfaces/Sale';

type Props = {
    setTableContent: React.Dispatch<React.SetStateAction<ISaleItem[]>>
    setcustomerSaleReturnItems: React.Dispatch<React.SetStateAction<ISaleItem[]>>
    setFocusedCustomer: React.Dispatch<React.SetStateAction<(ICustomer | null[]) | null | undefined>>
}

const POS_Customer_Edit_sale:React.FC<Props> = ({setTableContent, setcustomerSaleReturnItems, setFocusedCustomer}) => {
    const authHeader = useAuthHeader();
    const [form] = Form.useForm();
    const [customer, setCustomer] = useState<ICustomer>();
    const [selectedProduct, setSelectedProduct] = useState<IProductWithBalance | undefined>();
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1); 

    const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
                ['customers'],
                () => getCustomersWithBalance(authHeader(), { customer_type: 'all'} )
    );

    useEffect(() => {
        if (customer) {
            setFocusedCustomer((prev) => {
                
                if (!prev) {
                    return [customer];
                }
                const updatedArray = [...prev];
                
                updatedArray[3] = customer;
                
                return updatedArray;
            });
        }
    },[customer])

    const onCustomerChange = (_: string, option: ICustomer) => {
        setCustomer(option)

        if (option.customer_type === 'wholesaler') {
            form.setFieldValue("unit_price", selectedProduct?.wholesale_price);
            // setUnitPrice(typeof selectedProduct?.wholesale_price === 'undefined' ? 0 : selectedProduct?.wholesale_price);
        }else {
            form.setFieldValue("unit_price", selectedProduct?.retail_price);
            // setUnitPrice(typeof selectedProduct?.retail_price === 'undefined' ? 0 : selectedProduct?.retail_price);
        }
    }

    const onCustomerSelectedProduct = (product: IProductWithBalance) => {
        if (customer && customer.customer_type === 'wholesaler') {
            form.setFieldValue("unit_price", product.wholesale_price);
            setUnitPrice(typeof product.wholesale_price === 'undefined' ? 0 : product.wholesale_price);
        }else{
            form.setFieldValue("unit_price", product.retail_price);
            setUnitPrice(typeof product.retail_price === 'undefined' ? 0 : product.retail_price);
        }

        setSelectedProduct(product);
        form.setFieldValue("product", product.sku_name);
    }

    const formClear = () => {
        form.resetFields();
        setUnitPrice(0);
        setQuantity(1);
        setSelectedProduct(undefined);
    }

    const savePurchase = () => {
    }

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
                label={'Select Customer'}
            >
                <AutoComplete 
                    allowClear={true}
                    bordered={true}
                    onSelect={(text: string, option: ICustomer) => onCustomerChange(text, option)}
                    placeholder="Search for Customer"
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
                <Button size={"large"} type="primary" onClick={savePurchase} disabled={(typeof selectedProduct === 'undefined') } >Save</Button>
                <Button size={"large"} onClick={() => formClear()}>Clear</Button>
            </Space>
        </Form>
        </>
)
}

export default POS_Customer_Edit_sale;