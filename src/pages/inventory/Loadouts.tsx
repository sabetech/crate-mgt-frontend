import type { DatePickerProps } from 'antd';
import { Form, DatePicker } from "antd";
const Loadouts = () => {

    const onChange: DatePickerProps['onChange'] = (date: any, dateString: any) => {

    }

    return (
        <>
            <h1>Loadouts</h1>
            <Form>
                <Form.Item
                    label="Date"
                    name="date">
                        <DatePicker onChange={onChange} />
                </Form.Item>
            </Form>
        </>
    )
}

export default Loadouts;