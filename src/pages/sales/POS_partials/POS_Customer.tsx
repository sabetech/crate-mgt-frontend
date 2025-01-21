import { useEffect, useState } from "react";
import { AutoComplete, Form, message, Input, Space, Button, Typography, InputNumber } from "antd";
import { ICustomer } from "../../../interfaces/Customer";
import { IProductWithBalance } from '../../../interfaces/Product'
import { getCustomersWithBalance } from '../../../services/CustomersAPI';
import { useQuery, useMutation } from '@tanstack/react-query'
import {useLocation, useNavigate} from 'react-router-dom';
import { ServerResponse } from '../../../interfaces/Server'
import { useAuthHeader } from 'react-auth-kit'
import { IOrder, ISaleItem } from '../../../interfaces/Sale';
import { pay, printReceipt as print } from '../../../services/SalesAPI'
import ProductSearch from "./_Shared/ProductSearch";

type Props = {
    setTableContent: React.Dispatch<React.SetStateAction<ISaleItem[]>>
}
const POS_Customer:React.FC<Props> = ({setTableContent}) => {
    const authHeader = useAuthHeader();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [selectedProduct, setSelectedProduct] = useState<IProductWithBalance | undefined>();
    const [customer, setCustomer] = useState<ICustomer>(location.state?.customer as ICustomer);
    const [quantity, setQuantity] = useState<number>(1); 

    const [selectedProducts, setSelectedProducts] = useState<ISaleItem[]>(location.state?.sales ?? []);

    const formClear = () => {
        form.resetFields();
        setUnitPrice(0);
        setQuantity(1);
        setSelectedProduct(undefined);
    }

    const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
            ['customers'],
            () => getCustomersWithBalance(authHeader(), { customer_type: 'all'} )
    );

    const { mutate: printAction } = useMutation({
            mutationFn: (values: IOrder) => {
                return print(values)
            },
            onSuccess: (data) => {
                console.log("data: ", data);
        
            },
        });

    const onCustomerChange = (_: string, option: ICustomer) => {
        setCustomer(option)

        if (option.customer_type === 'wholesaler') {
            form.setFieldValue("unit_price", selectedProduct?.wholesale_price);
            setUnitPrice(typeof selectedProduct?.wholesale_price === 'undefined' ? 0 : selectedProduct?.wholesale_price);
        }else {
            form.setFieldValue("unit_price", selectedProduct?.retail_price);
            setUnitPrice(typeof selectedProduct?.retail_price === 'undefined' ? 0 : selectedProduct?.retail_price);
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

    const savePurchase = () => {
        
        console.log("Selected Product: ", selectedProduct);
        console.log("form.getFieldValue(product): ", form.getFieldValue("product"));

        if (!selectedProduct || typeof selectedProduct === 'undefined' || typeof form.getFieldValue("product") === 'undefined' || form.getFieldValue("product") === '') {
            messageApi.open({
                type: 'error',
                content: "Please select a product"
            });
            return;
        }

        if (typeof form.getFieldValue("quantity") === 'undefined') {
            messageApi.open({
                type: 'error',
                content: "Please enter a quantity"
            });
            return;
        }

        const product = selectedProduct;
        const quantity = form.getFieldValue("quantity");
        const unitPrice = form.getFieldValue("unit_price");

        if (!customer) {
            messageApi.open({
                type: 'error',
                content: "Please Choose a customer!"
            });
            return;
        }

        if (typeof product !== 'undefined') {
            setSelectedProducts((prev) => [...prev, {id: product.id, product: product, quantity: quantity, key: product.id} as ISaleItem]);
        }
        

        // if (product.empty_returnable && customer.customer_type !== 'wholesaler') {
        //     if (emptiesBalance < quantity) { 
        //         messageApi.open({
        //             type: 'error',
        //             content: "Customer does not have enough empties to make this purchase"
        //         });
        //         return;
        //     }
        // }

        
        

        // if (product.empty_returnable) updateCustomerEmptiesBalance(-quantity);

        form.resetFields();
        (unitPrice || unitPrice > 0) && setUnitPrice(0);
        form.setFieldValue("customer", `${customer?.name} (${customer?.customer_type.toUpperCase()})`);
        form.setFieldValue("product", "");
        
    }

    useEffect(() => {
        if (selectedProducts) {
            setTableContent(selectedProducts);
        }



    },[selectedProducts])

    const { mutate } = useMutation({
            mutationFn: (values: IOrder) => {
                return pay(authHeader(), values)
            },
            onSuccess: (data: any, orderDetails: IOrder) => {
                orderDetails.transaction_id = data.data.transaction_id
                console.log("order details: ", orderDetails);
                printAction(orderDetails);
                if (location.state) navigate("/POS/orders");
    
                form.resetFields();
            },
            onError: (error: Error) => {
                console.log("error: ", error);
                messageApi.open({
                    type: 'error',
                    content: error.message + ". Please Check your internet connection and refresh the page."
                });
                setTimeout(messageApi.destroy, 2500);
            }
        });

    return (<>
        {contextHolder}
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
    </>)
}

export default POS_Customer;