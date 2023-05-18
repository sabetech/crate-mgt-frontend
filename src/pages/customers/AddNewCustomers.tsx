import { useForm } from "antd/es/form/Form";
import { Form, Input, Select, Button } from "antd";

const { Option } = Select;
const AddNewCustomers = () => {
    const [form] = useForm();

    const onFinish = (_values: any) => {

    }

    return (
        <>
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
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>

            </Form>
        </>
    )

}

export default AddNewCustomers;