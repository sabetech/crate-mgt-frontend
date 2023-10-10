import React from 'react';
import { Form, Space, Select, Button, Input } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { IProduct } from '../interfaces/Product';
import { getProducts } from '../services/ProductsAPI';
import { ServerResponse } from '../interfaces/Server';
import { useEffect } from 'react';
import { useAuthHeader } from 'react-auth-kit';

const { Option } = Select;
interface AddProductQuantityFieldsProps {
    is_returnable: boolean;
}

const AddProductQuantityFields = ({ is_returnable }: AddProductQuantityFieldsProps) => {

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
    </>
    )
}

export default AddProductQuantityFields;