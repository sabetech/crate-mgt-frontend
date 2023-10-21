import React from 'react';
import { Form, Space, Select, Button, Input, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { IProduct } from '../interfaces/Product';
import { getProducts } from '../services/ProductsAPI';
import { ServerResponse } from '../interfaces/Server';
import { useEffect } from 'react';
import { useAuthHeader } from 'react-auth-kit';

const { Option } = Select;
interface AddProductQuantityFieldsProps {
    name: string;
    is_returnable: boolean;
}

const AddProductQuantityFields = ({ name, is_returnable }: AddProductQuantityFieldsProps) => {

    const authHeader = useAuthHeader();
    const { data } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products'],
        () => getProducts(authHeader(), {is_returnable: is_returnable})
    );

    const [productList, setProductList] = React.useState<IProduct[] | undefined>([]);
    
    useEffect(() => {
        if (data) {
            setProductList(data.data?.map(item => ({
                ...item, 
                key: item.id
            })));
        }
    },[data]);

    return (
        <>
        <div>
        <Typography.Title level={5}>Product Quantities</Typography.Title>
            <Form.List name={name}>
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
                                                style={{ width: 400 }}
                                            >
                                                <Select disabled={!productList || productList.length === 0} style={{ width: 350 }} 
                                                showSearch
                                                filterOption={(input, option:any) =>
                                                    option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                  }
                                                >
                                                    {
                                                    productList && productList.map((item) => (
                                                        <Option key={item.key} value={item.id}>
                                                            {item.sku_name}
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
                                    style={{ width: 400 }}
                                    >
                                    <Input placeholder={"Quantity"} />
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
    </>
    )
}

export default AddProductQuantityFields;