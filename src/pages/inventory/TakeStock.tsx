import { DatePicker, Form, Button, Typography,message } from "antd";
import AddProductQuantityFields from "../../components/AddProductQuantityFields";
import { useForm } from "antd/es/form/Form";
import { useMutation } from "@tanstack/react-query";
import { takeStock } from "../../services/InventoryAPI";
import { useAuthToken } from "../../hooks/auth";
import { useNavigate } from "react-router-dom";
import { AppError } from "../../interfaces/Error";

const TakeStock = () => {

    const [form] = useForm();
    const authToken = useAuthToken();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const { mutate, isLoading: isSubmitting } = useMutation({
        mutationFn: (values: any) => takeStock( authToken, values),
        onSuccess: (data) => {
            console.log(data);
            success(data?.data || "")
            form.resetFields();
            navigate("/warehouse/stockinfo")
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

    const handleSubmit = () => {
        console.log(form.getFieldsValue());

        //check if date field is empty
        if (!form.getFieldsValue().date) {
            messageApi.open({
                type: 'error',
                content: "Please select a date"
            });
            setTimeout(messageApi.destroy, 2500);
            return;
        }

        const formValues = form.getFieldsValue();
        
        //TODO: validate formValues before calling mutate
        mutate(formValues);
        
    }

    return (
        <>
            {contextHolder}
            <Typography.Title level={2}>Take Stock</Typography.Title>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="vertical"
                size={'large'}
                form={form}
                onFinish={handleSubmit}
            >
                <Form.Item label="Date" name={'date'} >
                    <DatePicker 
                    />
                </Form.Item>

                <Form.Item label="Products">
                    <AddProductQuantityFields name={"products"} is_returnable={false} />
                </Form.Item>

                <Form.Item label="Breakages">
                    <AddProductQuantityFields name={"breakages"} is_returnable={false} />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit" loading={isSubmitting} >Submit</Button>
                </Form.Item>
                
            </Form>
        </>
    )
}

export default TakeStock;