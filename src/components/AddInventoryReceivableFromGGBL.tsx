import { Button, Form } from "antd";
import type { DatePickerProps } from 'antd';
import { DatePicker, Input, message } from 'antd';
import AddProductQuantityFields from "./AddProductQuantityFields";
import { useMutation } from "@tanstack/react-query";
import { addReceivableToInventory } from "../services/InventoryAPI";
import { useAuthHeader } from "react-auth-kit";
import { IInventoryReceivableRequest } from "../interfaces/Inventory";
import { AppError } from "../interfaces/Error";
import { useState } from "react";

const AddInventoryReceivableFromGGBL = () => {
    const [form] = Form.useForm();
    const authHeader = useAuthHeader();
    const [date, setDate] = useState<string>();
    const [messageApi, contextHolder ] = message.useMessage();

    const { mutate } = useMutation({
        mutationFn: (values: IInventoryReceivableRequest) => addReceivableToInventory(values, authHeader()),
        onSuccess: (data) => {
            success(data.data || "")
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
        messageApi.destroy();
        messageApi.success(msg, 2.5);
    }

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDate(dateString);
    };

    const onFinish = (formValues: any) => {
        console.log("FORm VALUES", formValues);

        const inventoryReceivableRequest = {
            date: date,
            purchase_order_id: formValues.po_number,
            products: formValues.products
        } as IInventoryReceivableRequest;

        mutate(inventoryReceivableRequest);

        messageApi.loading("Adding Inventory Receivable ...", 0);

    }

    const onFinishedFailed = (_: any) => {

    }

    return (
        <>
        {contextHolder}
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
                            <DatePicker onChange={onChange} />
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