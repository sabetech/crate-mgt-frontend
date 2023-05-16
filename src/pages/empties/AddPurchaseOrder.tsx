import React from 'react';
import { Button, Form, Input, DatePicker, Space, Select, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query';
import { IProduct } from '../../interfaces/Product';
import { ServerResponse } from '../../interfaces/Server';
import { getProducts } from '../../services/ProductsAPI';
import { useEffect } from 'react';

const { Option } = Select;
const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

const AddPurchaseOrder = () => {
    const [form] = Form.useForm();

    const { isLoading, data } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products'],
        () => getProducts("")
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

    const onFinish = (values: any) => {

    }

    return (
        <div>
            <h1>Add Purchase Order</h1>
            
            <Form 
                style={{ maxWidth: '90%' }}
                layout={'vertical'}
                size={'large'}
            >
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px'}}>
                    <div>
                        <Form.Item 
                            label="Purchase Order Number"
                            rules={[{ required: true, message: 'Please Enter Purchase Order' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="Date">
                            <DatePicker />
                        </Form.Item>

                        <Form.Item label="Vehicle Number">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Received By">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Delivered By">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                            <Upload action="/upload.do" listType="picture-card">
                                <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
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
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )

}

export default AddPurchaseOrder;