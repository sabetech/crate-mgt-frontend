import { useState } from "react";
import { AutoComplete, Form, message } from "antd";
import { ICustomer } from "../../../interfaces/Customer";
import { IProductWithBalance } from '../../../interfaces/Product'
import { getCustomersWithBalance } from '../../../services/CustomersAPI';
import { useQuery, useMutation } from '@tanstack/react-query'
import {useLocation, useNavigate} from 'react-router-dom';
import { ServerResponse } from '../../../interfaces/Server'
import { useAuthHeader } from 'react-auth-kit'
import { IOrder, ISaleItem } from '../../../interfaces/Sale';
import { pay, printReceipt as print } from '../../../services/SalesAPI'

const POS_Customer = () => {
    const authHeader = useAuthHeader();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [selectedProduct, setSelectedProduct] = useState<IProductWithBalance | undefined>();

    const [customer, setCustomer] = useState<ICustomer>(location.state?.customer as ICustomer);

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

            <AutoComplete 
                allowClear={true}
                bordered={false}
                onSelect={(text: string, option: ICustomer) => onCustomerChange(text, option)}
                placeholder="Search for Customer"
                options={ customersResponse?.data.map(custmr => ({...custmr, value: `${custmr.name} (${custmr.customer_type.toUpperCase()})`})) }
                filterOption={(inputValue, option) =>
                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
            />
        </Form>
    </>)
}

export default POS_Customer;