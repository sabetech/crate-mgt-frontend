import { useState } from 'react';
import type { DatePickerProps } from 'antd';
import { Form, DatePicker, Typography, Button, AutoComplete, message } from "antd";
import { SendOutlined } from '@ant-design/icons';
import AddProductQuantityFields from '../../components/AddProductQuantityFields';
import { getCustomers } from '../../services/CustomersAPI'
import { ICustomer } from '../../interfaces/Customer'
import { ServerResponse } from '../../interfaces/Server';
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAuthToken } from '../../hooks/auth';
import { addLoadoutInfo } from '../../services/InventoryAPI';
import { useNavigate } from "react-router-dom";
import { AppError } from '../../interfaces/Error';
import { ILoadout } from '../../interfaces/Inventory';

const AddLoadouts = () => {
    const [form] = Form.useForm();
    const [date, setDate] = useState("");
    const [vse, setVse] = useState<ICustomer>();
    const authToken = useAuthToken();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onChange: DatePickerProps['onChange'] = (_: any, dateString: any) => {
        setDate(dateString)
    }

    const onCustomerChange = (_: string, option: ICustomer) => {        
        setVse(option)
    }

    const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
        ['customers'],
        () => getCustomers(authToken, {customer_type: 'retailer-vse'})
    )

    const onSearch = (value: string) => {
        console.log('searching ...:', value);
    };

    const { mutate, isLoading: isSubmitting } = useMutation({
        mutationFn: (values: ILoadout) => addLoadoutInfo(authToken, values),
        onSuccess: (data) => {
            success(data?.data || "")
            navigate("/warehouse/listloadouts");
            form.resetFields();
        },
        onError: (error: AppError) => {
            const digestedDetail = error.response.data.data.map((detail: any) => {
                return "SKU: "+detail.product.sku_name + " Quantity: "+ detail.quantity + " Required: " + detail.required + "\n"
            })

            messageApi.open({
                type: 'error',
                content: error.response.data.message + "::"+ digestedDetail.reduce((acc , val) => (val + acc), "")
            });
            setTimeout(messageApi.destroy, 2500);
        }
    });

    const onSubmit = () => {

        if (!date) {
            messageApi.open({
                type: 'error',
                content: "Please select a date"
            });
            setTimeout(messageApi.destroy, 2500);
            return;
        }

        if (!vse) {
            messageApi.open({
                type: 'error',
                content: "Please select a VSE"
            });
            setTimeout(messageApi.destroy, 2500);
            return;
        }

        if (typeof form.getFieldValue('products') === 'undefined' || form.getFieldValue('products').length === 0) {
            messageApi.open({
                type: 'error',
                content: "Please add products to loadout"
            });
            setTimeout(messageApi.destroy, 2500);
            return;
        }

       const formValues = {
        date: date,
        vse: vse,
        products: form.getFieldValue('products')
       } as ILoadout

       mutate(formValues)

    }

    const success = (msg:string) => {
        messageApi.open({
          type: 'success',
          content: msg,
        });
        setTimeout(messageApi.destroy, 2500);
    }

    return (
        <>
        { contextHolder }
            <Typography.Title level={2}>Add Loadouts</Typography.Title>
            <Form
                form={form}
                layout={'vertical'}
                style={{ maxWidth: '90%' }}
                size={'large'}
                onFinish={onSubmit}
            >
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '80px'}}>
                    <div>
                        <Form.Item
                            label="Date"
                            name="date"
                            rules={[{ required: true, message: 'Please Choose Date' }]}
                            >
                                <DatePicker onChange={onChange} />
                        </Form.Item>
                        <Form.Item
                            label="VSE"
                            name="vse"
                            rules={[{ required: true, message: 'Please Enter VSE' }]}
                            >
                             <AutoComplete 
                                    allowClear={true}
                                    bordered={false}
                                    onSearch={onSearch}
                                    onChange={(text: string, option: any) => onCustomerChange(text, option)}
                                    placeholder="Search for VSE"
                                    options={ customersResponse?.data.map(custmr => ({...custmr, value: `${custmr.name} (${custmr.customer_type.toUpperCase()})`})) }
                                    filterOption={(inputValue, option) =>
                                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                      }
                                />
                        </Form.Item>
                    </div>
                    <div>
                        <AddProductQuantityFields name={'products'} is_returnable={false} />
                    </div>
                </div>

                <Form.Item >
                    <Button type="primary" htmlType="submit" icon={<SendOutlined />}
                        loading={isSubmitting}
                    >
                        Submit
                    </Button>
                </Form.Item>

            </Form>
            
        </>
    )
}

export default AddLoadouts;