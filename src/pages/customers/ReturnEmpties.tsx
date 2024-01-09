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

    const [productList, setProductList] = React.useState<IProduct[] | undefined>([]);
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
        
        let formValues: ICustomerReturnEmpties = {
            date: values.date.format('YYYY-MM-DD'),
            customer: values.customer_name,
            quantity_transacted: values['product-quanties'].reduce((acc: number, item: any) => acc + parseInt(item.quantity), 0),
            products: values['product-quanties'].map((item: any) => ({
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
                        <Form.Item label="Date" name={"date"}>
                            <DatePicker />
                        </Form.Item>
                        
                        {/* Make the customers searchable... */}
                        <Form.Item label="Customer" name={"customer_name"}>
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
            
                    <div>
                        <Form.List name="product-quanties">
                            {(fields, { add, remove }) => (
                                <>
                                    {
                                    fields.map((field) => (
                                        <Space key={field.key} align="baseline">
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prevValues, curValues) =>
                                                    prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                                }
                                                >
                                                {
                                                    () => (
                                                        <Form.Item
                                                            {...field}
                                                            label="Product"
                                                            name={[field.name, 'product']}
                                                            rules={[{ required: true, message: 'Product missing'}]}
                                                        >
                                                            <Select disabled={!productList || productList.length === 0} style={{ width: 130 }}>
                                                               {
                                                                productList && productList.map((item) => (
                                                                    <Option key={item.key} value={item.id}>
                                                                        {item.sku_code}
                                                                    </Option>
                                                                ))
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                    )
                                                }
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Quantity"
                                                name={[field.name, 'quantity']}
                                                rules={[{ required: true, message: 'Missing Qty' }]}
                                                >
                                                <Input />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Space>
                                    ))   
                                }
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add Product and Quantity Fields
                                    </Button>
                                </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </div>
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