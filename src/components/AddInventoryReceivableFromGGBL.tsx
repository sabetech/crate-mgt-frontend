import { Button, Form } from "antd";
import type { DatePickerProps } from 'antd';
import { DatePicker, Space, Input } from 'antd';
import AddProductQuantityFields from "./AddProductQuantityFields";

const AddInventoryReceivableFromGGBL = () => {
    const [form] = Form.useForm();

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    const onFinish = (_: any) => {

    }

    const onFinishedFailed = (_: any) => {

    }

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishedFailed}
                layout={'vertical'}
                style={{ maxWidth: '90%' }}
                size="large"
            
            >
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '80px'}}>
                    <div>
                        <Form.Item label={"Date"} name={"date"} rules={[{required: true, message: 'Please Choose Date'}]}>
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
                    </div>
                    <div>
                        <AddProductQuantityFields name={"products"}  is_returnable={false} />
                    </div>
                </div>
                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default AddInventoryReceivableFromGGBL;