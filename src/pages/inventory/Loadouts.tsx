import type { DatePickerProps } from 'antd';
import { Form, DatePicker, Input, Space } from "antd";
import AddProductQuantityFields from '../../components/AddProductQuantityFields';

const Loadouts = () => {
    const [form] = Form.useForm();

    const onChange: DatePickerProps['onChange'] = (date: any, dateString: any) => {

    }

    return (
        <>
            <h1>Loadouts</h1>
            <Form
                form={form}
                layout={'vertical'}
                style={{ maxWidth: '90%' }}
                size={'large'}
            >
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px'}}>
                    <div>
                        <Form.Item
                            label="Date"
                            name="date">
                                <DatePicker onChange={onChange} />
                        </Form.Item>
                        <Form.Item
                            label="VSE"
                            name="vse">
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <AddProductQuantityFields is_returnable={false} />
                    </div>
                </div>
            </Form>
            
        </>
    )
}

export default Loadouts;