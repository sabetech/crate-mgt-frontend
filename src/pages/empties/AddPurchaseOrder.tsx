import React from 'react';
import { Button, Form, Input, DatePicker, Space, Select, Upload, App, notification, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@tanstack/react-query';
import { IProduct } from '../../interfaces/Product';
import { ServerResponse } from '../../interfaces/Server';
import { getProducts } from '../../services/ProductsAPI';
import { useEffect } from 'react';
import { IEmptyLog } from '../../interfaces/Empties';
import { addEmptiesLog } from '../../services/EmptiesAPI';


const { Option } = Select;
const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

const AddPurchaseOrder = () => {
    const [form] = Form.useForm();

    

    const [messageApi, contextHolder ] = message.useMessage();
    const { data } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products'],
        () => getProducts("")
    );
    
    const { mutate } = useMutation({
        mutationFn: (values: IEmptyLog) => addEmptiesLog(values, ""),
        onSuccess: (data) => {
            success(data.data || "")
        }
    });
    
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
        console.log(values)

        console.log(form.getFieldsValue(true))

        let formValues = {
            ...values,
            "product-quanties": JSON.stringify(values['product-quanties'].map((item: any) => ({
                product: item.product,
                quantity: item.quantity
            })))
        };

        mutate(formValues)
        
    }

    const success = (msg: string) => {
        messageApi.open({
            type: 'success',
            content: msg,
            duration: 0
        });
        setTimeout(messageApi.destroy, 2500);
    }

    return (
        <div>
            {contextHolder}
            <h1>Add Purchase Order</h1>
            
            <Form 
                form={form}
                style={{ maxWidth: '90%' }}
                layout={'vertical'}
                size={'large'}
                onFinish={onFinish}
            >
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px'}}>
                    <div>
                        <Form.Item 
                            label="Purchase Order Number"
                            rules={[{ required: true, message: 'Please Enter Purchase Order' }]}
                            name="purchase_order"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="Date" name="date">
                            <DatePicker />
                        </Form.Item>

                        <Form.Item label="Vehicle Number" name="vehicle_number">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Received By" name="received_by">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Delivered By" name="delievered_by">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile} name="image_ref">
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
                    <Button type="primary" htmlType="submit" >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )

}

export default AddPurchaseOrder;