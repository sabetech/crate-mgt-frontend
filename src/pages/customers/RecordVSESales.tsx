import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Form, DatePicker, AutoComplete, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { getCustomers, recordVSESales } from "../../services/CustomersAPI";
import { useAuthHeader } from 'react-auth-kit';
import { ICustomer } from "../../interfaces/Customer";
import { ServerResponse } from "../../interfaces/Server";
import { AppError } from "../../interfaces/Error";
import { useNavigate } from "react-router-dom";
import AddProductQuantityFields from "../../components/AddProductQuantityFields";

const RecordVSESales: React.FC = () => {
    const [form] = useForm();
    const navigate = useNavigate();
    const authHeader = useAuthHeader();
    const [messageApi, contextHolder ] = message.useMessage();

    const { mutate } = useMutation({
        mutationFn: (values: any) => recordVSESales(values.customer_id, values, authHeader()),
        onSuccess: (data) => {
            success(data?.data || "")
            navigate("/customers")
            form.resetFields();
        },
        onError: (error: AppError) => {
            messageApi.open({
                type: 'error',
                content: error.message + ". Please Check your internet connection and refresh the page."
            });
            setTimeout(messageApi.destroy, 2500);
        }}
    )

    const success = (msg: string) => {
        messageApi.open({
            type: 'success',
            content: msg,
            duration: 0
        });
        setTimeout(messageApi.destroy, 2500);
    }

    const onCustomerChange = (value: string, option: ICustomer) => {
        console.log(`selected Customer ${value}:::`, option);
    }

    const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
        ['customers'],
        () => getCustomers(authHeader(), {customer_type: 'retailer-vse'})
    )

    const onSearch = (value: string) => {
        console.log('searching ...:', value);
    };

    const onFinish = (_values: any) => {
        console.log(_values);
        mutate(_values);
    }
    return (<>
        {contextHolder}
        <h1>Record a Sale</h1>
            <Form 
                form={form}
                style={{ maxWidth: '90%' }}
                layout={'vertical'}
                size={'large'}
                onFinish={onFinish}
            >
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '80px'}}>
                <div>
                    <Form.Item label="Date" name={"date"}>
                        <DatePicker  />
                    </Form.Item>
                    <Form.Item label="Customer" name={"customer_id"}>
                        <AutoComplete 
                                allowClear={true}
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
                    <h2> Empties Returned </h2>
                    <AddProductQuantityFields name={"product_quantities"} is_returnable={true} />
                </div>
            </div>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />} size={"large"} loading={false}>
                Submit
            </Button>
        </Form>
    </>)
}

export default RecordVSESales;