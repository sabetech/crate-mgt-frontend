import { DatePicker, Form, Button } from "antd";
import AddProductQuantityFields from "../../components/AddProductQuantityFields";
const TakeStock = () => {
    return (
        <>
            <h1>Take Stock</h1>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="vertical"
                size={'large'}
            >
                <Form.Item label="Date">
                    <DatePicker />
                </Form.Item>

                <AddProductQuantityFields is_returnable={false} />

                <Form.Item >
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
                
            </Form>
        </>
    )
}

export default TakeStock;