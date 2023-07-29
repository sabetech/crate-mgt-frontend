import type { DatePickerProps } from 'antd';
import { useForm } from "antd/es/form/Form";
import { Form, Input, Select, Upload, DatePicker, Space } from "antd";
import { PlusOutlined } from '@ant-design/icons';

const CreateCustomerEmptiesLoan = () => {
    const [form] = useForm();

    const onChange = (value: string) => {
        console.log(`selected ${value}`);
      };
      
    const onSearch = (value: string) => {
    console.log('search:', value);
    };

    const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
      };
    
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onFinish = (_values: any) => {

    }

    return (
        <>
            <h1>EmptiesLoan</h1>
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
                    <Select
                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                        {
                            value: 'jack',
                            label: 'Jack',
                        },
                        {
                            value: 'lucy',
                            label: 'Lucy',
                        },
                        {
                            value: 'tom',
                            label: 'Tom',
                        },
                        ]}
                    />

                </Form.Item>

                <Form.Item
                    label="Loan Date"
                    name="loan_date"
                >
                   <Space direction="vertical">
                        <DatePicker onChange={onDateChange} />
                    </Space>
                </Form.Item>
                
                <Form.Item
                    label="Number of Loaned Empties"
                    name="number_loaned_empties"
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile} name="image_ref">
                    <Upload listType="picture-card">
                        <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
                </Form.Item>

             
            </Form>
        </>
    );
}

export default CreateCustomerEmptiesLoan;