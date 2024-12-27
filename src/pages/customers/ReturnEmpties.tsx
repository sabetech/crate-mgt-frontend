import React from 'react';
import { Button, Form, Input, DatePicker, Space, Select, message, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined, Loading3QuartersOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@tanstack/react-query';
import { IProduct } from '../../interfaces/Product';
import { ServerResponse } from '../../interfaces/Server';
import { addCustomerReturnEmpties, getCustomers } from '../../services/CustomersAPI';
import { getProducts } from '../../services/ProductsAPI';
import { useEffect } from 'react';
import { useAuthHeader } from 'react-auth-kit';
import { ICustomerReturnEmpties, ICustomer } from '../../interfaces/Customer';
import AddProductQuantityFields from '../../components/AddProductQuantityFields';

const { Option } = Select;
const antIcon = <Loading3QuartersOutlined style={{ fontSize: 24, marginRight: 10 }} spin />;

const CustomerReturnEmpties = () => {
    const authHeader = useAuthHeader();
    const [form] = Form.useForm();
    const [messageApi, contextHolder ] = message.useMessage();

    const { data: productsData } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products'],
        () => getProducts(authHeader(), {is_returnable: true})
    );

    const { data: customers } = useQuery<ServerResponse<ICustomer[]>> (
        ['customers'],
        () => getCustomers(authHeader(), {customer_type: 'all'})
    );

    const { isLoading: isSubmitting, mutate } = useMutation({
        mutationFn: (values: ICustomerReturnEmpties) => addCustomerReturnEmpties(values, authHeader()),
        onSuccess: (data) => {
            success(data.data || "")
            form.resetFields();
        }
    });

    const [_, setProductList] = React.useState<IProduct[] | undefined>([]);
    const [customerList, setCustomerList] = React.useState<ICustomer[] | undefined>([]);
    
    useEffect(() => {
        if (productsData) {
            setProductList(productsData.data?.map(item => ({
                ...item, 
                key: item.id
            })));
        }
    },[productsData]);

    useEffect(() => {
        
        if (customers) {
            setCustomerList(customers.data.map(item => ({
                ...item,
                key: item.id
            })));
        }
    },[customers]);

    const success = (msg: string) => {
        messageApi.open({
            type: 'success',
            content: msg,
            duration: 0
        });
        setTimeout(messageApi.destroy, 2500);
    }

//     const filterOption = (input: string, option: { label: string; value: string }) =>
//   (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onFinish = (values: any) => {
        
        if (typeof values['product-quantities'] === 'undefined' || values['product-quantities'].length === 0) {
            messageApi.open({
                type: 'warning',
                content: "Please add at least one product to transact."
            });
            return;
        }

        if (!values.date) {
            messageApi.open({
                type: 'warning',
                content: "Please select a date."
            });
            return;
        }

        if (!values.customer_name) {
            messageApi.open({
                type: 'warning',
                content: "Please select a customer."
            });
            return;
        }

        if (!values.transaction_type) {
            messageApi.open({
                type: 'warning',
                content: "Please select a transaction type."
            });
            return;
        }

        let formValues: ICustomerReturnEmpties = {
            date: values.date.format('YYYY-MM-DD'),
            customer: values.customer_name,
            quantity_transacted: values['product-quantities'].reduce((acc: number, item: any) => acc + parseInt(item.quantity), 0),
            products: values['product-quantities'].map((item: any) => ({
                product_id: item.product, // product id
                quantity: parseInt(item.quantity)
            })),
            transaction_type: values.transaction_type
        };

        mutate(formValues);
    }

    return (
        <div>
             {contextHolder}
            <h1>Add Customer Returning Empties</h1>
            
            <Form 
                style={{ maxWidth: '90%' }}
                layout={'vertical'}
                size={'large'}
                form={form}
                onFinish={onFinish}
                initialValues={{ transaction_type: 'in' }}
            >
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px'}}>
                    <div>
                        <Form.Item label="Date" name={"date"} required>
                            <DatePicker />
                        </Form.Item>
                        
                        {/* Make the customers searchable... */}
                        <Form.Item label="Customer" name={"customer_name"} required>
                            <Select 
                                style={{ width: 400 }}
                                showSearch
                                placeholder="Select a Customer"
                            >
                                {
                                    customerList && customerList.map((item) => (
                                        <Option key={ item.key } value={ item.id }>
                                            {item.name}(<em>{item.customer_type}</em>)
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        
                        <Form.Item label="Number of PCs" name={"pcs_number"} style={{ width: 400 }}>
                            <Input />
                        </Form.Item>                                

                        <Form.Item label="Transaction Type" name={"transaction_type"}>
                            <Select style={{ width: 400 }}>
                               <Option value={"in"}>In</Option>
                               <Option value={"out"}>Out</Option>
                            </Select>
                        </Form.Item>
                        
                    </div>
           
                <AddProductQuantityFields name="product-quantities" is_returnable={true} />
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                    {isSubmitting && <Spin indicator={antIcon} />} Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )

}

export default CustomerReturnEmpties;