import React from 'react';
import { Button, Form, Input, DatePicker, Space, Select, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@tanstack/react-query';
import { IProduct } from '../../interfaces/Product';
import { IEmptyReturnedLog } from '../../interfaces/Empties';
import { ServerResponse } from '../../interfaces/Server';
import { addEmptiesReturnedLog } from '../../services/EmptiesAPI';
import { getProducts } from '../../services/ProductsAPI';
import { useEffect } from 'react';

const { Option } = Select;

const AddReturningEmpties = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder ] = message.useMessage();

    const { isLoading, data } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products'],
        () => getProducts("")
    );

    const { mutate } = useMutation({
        mutationFn: (values: IEmptyReturnedLog) => addEmptiesReturnedLog(values, ""),
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

    const success = (msg: string) => {
        messageApi.open({
            type: 'success',
            content: msg,
            duration: 0
        });
        setTimeout(messageApi.destroy, 2500);
    }

    const onFinish = (values: any) => {
        console.log(values);

        console.log(form.getFieldsValue(true));

        let formValues: IEmptyReturnedLog = {
            date: values.date.format('YYYY-MM-DD'),
            vehicle_number: values.vehicle_number,
            returned_by: values.returned_by,
            quantity_returned: values['product-quanties'].reduce((acc: number, item: any) => acc + parseInt(item.quantity), 0),
            products: values['product-quanties'].map((item: any) => ({
                product_id: item.product, // product id
                quantity: parseInt(item.quantity)
            }))
        };

        mutate(formValues);

    }

    return (
        <div>
             {contextHolder}
            <h1>Add Returning Empties</h1>
            
            <Form 
                style={{ maxWidth: '90%' }}
                layout={'vertical'}
                size={'large'}
                form={form}
                onFinish={onFinish}
            >
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px'}}>
                    <div>
                        <Form.Item label="Date" name={"date"}>
                            <DatePicker />
                        </Form.Item>

                        <Form.Item label="Vehicle Number" name={"vehicle_number"}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Returned By" name={"returned_by"}>
                            <Input />
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

export default AddReturningEmpties;