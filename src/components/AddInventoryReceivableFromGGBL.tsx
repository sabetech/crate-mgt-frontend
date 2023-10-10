import { Form } from "antd";
import type { DatePickerProps } from 'antd';
import { DatePicker, Space, Input } from 'antd';
import AddProductQuantityFields from "./AddProductQuantityFields";

const AddInventoryReceivableFromGGBL = () => {
    const [form] = Form.useForm();

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    const onFinish = (values: any) => {

    }

    const onFinishedFailed = (errorInfo: any) => {

    }

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishedFailed}
                layout={'vertical'}
                style={{ maxWidth: '30%' }}
                size="large"
            
            >
                <Form.Item label={"Date"} name={"date"}>
                    <Space direction={'vertical'}>
                        <DatePicker onChange={onChange} />
                    </Space>
                </Form.Item>

                <Form.Item 
                    label={"Purchase Order Number"} 
                    name={"po_number"}
                    rules={[{required: true, message: 'Please Enter Purchase Order Number'}]}
                    >
                    <Input />
                </Form.Item>

                <AddProductQuantityFields is_returnable={false} />
            </Form>
        </>
    )
}

export default AddInventoryReceivableFromGGBL;