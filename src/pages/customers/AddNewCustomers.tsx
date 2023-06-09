import { useForm } from "antd/es/form/Form";
import { Form, Input, Select, Button, message, Spin } from "antd";
import { useMutation } from "@tanstack/react-query";
import { addCustomer } from "../../services/CustomersAPI";
import { useAuthHeader } from "react-auth-kit";
import { AppError } from "../../interfaces/Error";
import { Loading3QuartersOutlined } from '@ant-design/icons'

const { Option } = Select;
const antIcon = <Loading3QuartersOutlined style={{ fontSize: 24, marginRight: 10 }} spin />;
const AddNewCustomers = () => {
    const [form] = useForm();
    const authHeader = useAuthHeader();
    const [messageApi, contextHolder] = message.useMessage();

    const { mutate, isLoading: isSubmitting } = useMutation({
        mutationFn: (values: any) => addCustomer(values, authHeader()),
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
 
    const success = (msg:string) => {
        messageApi.open({
          type: 'success',
          content: msg,
        });
        setTimeout(messageApi.destroy, 2500);
    }
    
    const onFinish = (_values: any) => {
        console.log(_values);
        mutate(_values);
    }

    return (
        <>
            {contextHolder}
            <Button size="large" style={{float:"right"}}>Import Customer from Excel</Button>

            <h1>Add A Customer</h1>
            <Form 
                form={form}
                style={{ maxWidth: '50%' }}
                layout={'vertical'}
                size={'large'}
                onFinish={onFinish}
            >
                <Form.Item 
                    label="Customer Name"
                    rules={[{ required: true, message: 'Please enter customer\'s name' }]}
                    name="customer_name"
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter customer\'s phone number' }]}
                    name="phone_number"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Customer Type"
                    name="customer_type"
                >
                    <Select style={{ width: 130 }}>
                        <Option value="wholesaler">Wholesaler</Option>
                        <Option value="retailer">Retailer</Option>
                    </Select>
                </Form.Item>

                <Form.Item

                >
                    <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                    {isSubmitting && <Spin indicator={antIcon} />} Submit
                    </Button>
                </Form.Item>

            </Form>
        </>
    )

}

export default AddNewCustomers;