import React from 'react';
import { Button, Form, Input, DatePicker, message, Spin } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@tanstack/react-query';
import { IProduct } from '../../interfaces/Product';
import { IEmptyReturnedLog } from '../../interfaces/Empties';
import { ServerResponse } from '../../interfaces/Server';
import { addEmptiesReturnedLog } from '../../services/EmptiesAPI';
import { getProducts } from '../../services/ProductsAPI';
import { useEffect } from 'react';
import { useAuthHeader } from 'react-auth-kit';
import AddProductQuantityFields from '../../components/AddProductQuantityFields';

const antIcon = <Loading3QuartersOutlined style={{ fontSize: 24, marginRight: 10 }} spin />;

const AddReturningEmpties = () => {
    const authHeader = useAuthHeader();
    const [form] = Form.useForm();
    const [messageApi, contextHolder ] = message.useMessage();

    const { data } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products'],
        () => getProducts(authHeader(), { is_returnable: true })
    );

    const { isLoading: isSubmitting, mutate } = useMutation({
        mutationFn: (values: IEmptyReturnedLog) => addEmptiesReturnedLog(values, authHeader()),
        onSuccess: (data) => {
            success(data.data || "")
            form.resetFields();
        }
    });

    const [_, setProductList] = React.useState<IProduct[] | undefined>([]);
    
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
        
        let formValues: IEmptyReturnedLog = {
            date: values.date.format('YYYY-MM-DD'),
            vehicle_number: values.vehicle_number,
            returned_by: values.returned_by,
            pallets_number: values.pallets_number,
            pcs_number: values.pcs_number,
            quantity: values.products.reduce((acc: number, item: any) => acc + parseInt(item.quantity), 0),
            products: values.products.map((item: any) => ({
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

                        <Form.Item label="Number of Pallets" name={"pallets_number"}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Number of PCs" name={"pcs_number"}>
                            <Input />
                        </Form.Item>
                    </div>
            
                    <div>
                        <AddProductQuantityFields name={"products"} is_returnable={true} />
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

export default AddReturningEmpties;