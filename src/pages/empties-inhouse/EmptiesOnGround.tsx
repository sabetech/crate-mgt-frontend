import React from 'react';
import { Button, Form, Input, DatePicker, Space, Select, message, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined, Loading3QuartersOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@tanstack/react-query';
import { IProduct } from '../../interfaces/Product';
import { ServerResponse } from '../../interfaces/Server';
import { AddInHouseEmptiesCount } from '../../services/EmptiesAPI';
import { getProducts } from '../../services/ProductsAPI';
import { useEffect } from 'react';
import { useAuthHeader } from 'react-auth-kit';
import { AppError } from '../../interfaces/Error';
import { IEmptiesInHouseCount } from '../../interfaces/Empties';

const { Option } = Select;
const antIcon = <Loading3QuartersOutlined style={{ fontSize: 24, marginRight: 10 }} spin />;

const SaveInHouseEmpties = () => {
    const authHeader = useAuthHeader();
    const [form] = Form.useForm();
    const [messageApi, contextHolder ] = message.useMessage();
    const [selectedProducts, setSelectedProducts] = React.useState<IProduct[] | undefined>(undefined);

    const { data: productsData } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products'],
        () => getProducts(authHeader())
    );

    const { mutate, isLoading: isSubmitting } = useMutation({
        mutationFn: (values: any) => AddInHouseEmptiesCount(values, authHeader()),
        onSuccess: (data) => {
            success(data?.data || "")
            form.resetFields();
        },
        onError: (error: AppError) => {
            messageApi.open({
                type: 'error',
                content: error.message + ". Please Check your internet connection and refresh the page."
            });
            setTimeout(messageApi.destroy, 2500);
        }
    });

    const [productList, setProductList] = React.useState<IProduct[] | undefined>([]);
    
    useEffect(() => {
        if (productsData) {
            setProductList(productsData.data?.map(item => ({
                ...item, 
                key: item.id
            })));
        }
    },[productsData]);

    const updateProductList = (value: number ) => {
        
        if (productList) {
            // setProductList( (prev) => prev?.filter(item => item.id !== value))
            setSelectedProducts((prev) => {
                if (prev) {
                    const product = prev.find(item => item.id === value);
                    if (product) {
                        return prev.filter(item => item.id !== value);
                    } else {
                        return [...prev, productList.find(item => item.id === value)!];
                    }
                } else {
                    return [productList.find(item => item.id === value)!];
                }
            });
        }
    }

    const handleOnChange = (test: any) => {
        console.log("Value passed::", test);
    }

    useEffect(() => {
        console.log("SELECTED PRODUCTS", selectedProducts);
        

    }, [selectedProducts])
    
    const success = (msg: string) => {
        messageApi.open({
            type: 'success',
            content: msg,
            duration: 0
        });
        setTimeout(messageApi.destroy, 2500);
    }

    const onFinish = (values: any) => {
        
        if (!values['product-quanties']) {
            values['product-quanties'] = [];
        }

        if (!values['fulls-quantity']) {
            values['fulls-quantity'] = [];
        } 

        if (!values['date']) {
            messageApi.open({
                type: 'error',
                content: 'Please select a date'
            });
            return;
        }

        if (values['product-quanties'].length === 0 && values['fulls-quantity'].length === 0) {
            messageApi.open({
                type: 'error',
                content: 'Please add at least one product and quantity'
            });
            return;
        }

        let formValues: IEmptiesInHouseCount = {
            date: values.date.format('YYYY-MM-DD'),
            quantity: values['product-quanties']?.reduce((acc: number, item: any) => acc + parseInt(item.quantity), 0) || 0 
            + 
            values['fulls-quantity']?.reduce((acc: number, item: any) => acc + parseInt(item.quantity), 0) || 0,
            
            empties_on_ground_products: [
                ...values['product-quanties']?.map((item: any) => ({
                product_id: item.product, // product id
                quantity: parseInt(item.quantity),
                is_empty: true
            })),
            ...values['fulls-quantity']?.map((item: any) => ({
                product_id: item.product, // product id
                quantity: parseInt(item.quantity),
                is_empty: false
            }))],
            pcs_number: values['pcs_number'],
        };

        mutate(formValues)

    }

    return (
        <div>
             {contextHolder}
            <h1>Save Empties Count On Ground</h1>
            
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
                        
                        <Form.Item label="Number of PCs" name={"pcs_number"} style={{ width: 400 }} initialValue={0} required>
                            <Input />
                        </Form.Item>
                    </div>
            
                    <div>
                        <h2>Empties</h2>
                        <Form.List name="product-quanties">
                            {(fields, { add, remove }) => (
                                <>
                                    {
                                    fields.map((field) => (
                                        <Space key={field.key+"empty"} align="baseline">
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
                                                            <Select 
                                                                disabled={!productList || productList.length === 0} 
                                                                style={{ width: 130 }} onChange={updateProductList}
                                                                options={ productList && productList.map((item) => (
                                                                    {
                                                                        value: item.id,
                                                                        label: item.sku_code,
                                                                        disabled: false
                                                                    }
                                                                ))
                                                                }
                                                            />
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

                        <h2>Fulls</h2>
                        <Form.List name="fulls-quantity">
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

export default SaveInHouseEmpties;