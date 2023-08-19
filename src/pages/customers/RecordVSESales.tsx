import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Form, DatePicker, Select, Input, Space, Button, message } from "antd";
import { MinusCircleOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { getCustomers } from "../../services/CustomersAPI";
import { useAuthHeader } from 'react-auth-kit';
import { ICustomer } from "../../interfaces/Customer";
import { ServerResponse } from "../../interfaces/Server";
import { AppError } from "../../interfaces/Error";
import { IProduct } from "../../interfaces/Product";
import { getProducts } from "../../services/ProductsAPI";

const { Option } = Select;
const RecordVSESales: React.FC = () => {
    const [form] = useForm();
    const [customerList, setCustomerList] = React.useState<ICustomer[] | undefined>([]);
    const authHeader = useAuthHeader();
    const [messageApi, contextHolder ] = message.useMessage();

    const { data: customers } = useQuery<ServerResponse<ICustomer[]>> (
        ['customers'],
        () => getCustomers(authHeader())
    );

    const { data } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products'],
        () => getProducts(authHeader()),
        {
            onError: (error: AppError) => {
                messageApi.open({
                    type: 'error',
                    content: error.message + ". Please Check your internet connection and refresh the page."
                });
                setTimeout(messageApi.destroy, 2500);
            }
        } 
    );
    
    useEffect(() => {
        
        if (customers) {
            setCustomerList(customers.data.map(item => ({
                ...item,
                key: item.id
            })));
        }
    },[customers]);

    const [productList, setProductList] = React.useState<IProduct[] | undefined>([]);
    
    useEffect(() => {
        if (data) {
            setProductList(data.data?.map(item => ({
                ...item, 
                key: item.id
            })));
        }
    },[data]);

    const onFinish = (_values: any) => {
        console.log(_values);
           // mutate(_values);
    }
    return (<>
        <h1>Record a Sale</h1>
            <Form 
                form={form}
                style={{ maxWidth: '50%' }}
                layout={'vertical'}
                size={'large'}
                onFinish={onFinish}
            >
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px'}}>
                <div>
                    <Form.Item label="Date" name={"date"}>
                        <DatePicker />
                        {/* Make the customers searchable... */}
                    </Form.Item>
                    <Form.Item label="Customer" name={"customer_name"}>
                        <Select style={{ width: 400 }}>
                            {
                                customerList && customerList.map((item) => (
                                    <Option key={ item.key } value={ item.id }>
                                        {item.name}(<em>{item.customer_type}</em>)
                                    </Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </div>
                <div>
                    <h3> Products Sold </h3>
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

                    <h3> Empties Returned </h3>
                        <Form.List name="empties-returned">
                            {(fields, { add, remove }) => (
                                <>
                                    {
                                    fields.map((field) => (
                                        <Space key={field.key+"full"} align="baseline">
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
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} size={"large"} loading={false}>
                    Submit
                </Button>
            </div>
        </Form>
    </>)
}

export default RecordVSESales;