import { Button, Form, Upload, Alert } from "antd";
import { PlusOutlined} from '@ant-design/icons'
import type { DatePickerProps } from 'antd';
import { DatePicker, Input, message } from 'antd';
import AddProductQuantityFields from "./AddProductQuantityFields";
import { useMutation } from "@tanstack/react-query";
import { addReceivableToInventory } from "../services/InventoryAPI";
import { useAuthToken } from "../hooks/auth";
import { IInventoryReceivableRequest } from "../interfaces/Inventory";
import { AppError } from "../interfaces/Error";
import { useState } from "react";

const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

const AddInventoryReceivableFromGGBL = () => {
    const [form] = Form.useForm();
    const authToken = useAuthToken();
    const [date, setDate] = useState<string>();
    const [messageApi, contextHolder ] = message.useMessage();

    const { mutate } = useMutation({
        mutationFn: (values: IInventoryReceivableRequest) => addReceivableToInventory(values, authToken ?? ""),
        onSuccess: (data) => {
            success(data.data || "")
            form.resetFields();
        },
        onError: (error: AppError) => {

            messageApi.open({
                type: 'error',
                content: error.response.data.message
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

        if (!formValues.image_ref || formValues.image_ref.length === 0) {
            messageApi.open({
                type: 'error',
                content: "Please upload an image"
            });
            setTimeout(messageApi.destroy, 2500);
            return;
        }

        if (typeof formValues.products === 'undefined') {
            messageApi.open({
                type: 'error',
                content: "Please select at least one product"
            });
            setTimeout(messageApi.destroy, 2500);
            return;
        }
        const inventoryReceivableRequest = {
            date: date, 
            purchase_order_id: formValues.po_number,
            products: formValues.products,
            received_by: formValues.received_by,
            delivered_by: formValues.delievered_by,
            vehicle_number: formValues.vehicle_number,
            pallets_number: formValues.pallets_number,
            image_ref: formValues.image_ref[0].originFileObj,
            quantity: formValues.products.reduce((acc: number, item: any) => acc + parseInt(item.quantity), 0)
        } as IInventoryReceivableRequest

        mutate(inventoryReceivableRequest);

        messageApi.loading("Adding Inventory Receivable ...", 0);

    }

    const onFinishedFailed = (_: any) => {

    }

    return (
        <>
        {contextHolder}
        <Alert
            message="Help"
            description="Whenever a truck from GGBL comes to deliver crates, 
                        you fill in the details here. Use the product quantities 
                        to choose which products are being delivered. 
                        Include a picture of the purchase order!"
            type="info"
            showIcon
            style={{marginBottom: 20}}
        />
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

                        <Form.Item label="Received By" name="received_by">
                            <Input />
                        </Form.Item>
                        
                        <Form.Item label="Delivered By" name="delievered_by">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Vehicle Number" name="vehicle_number">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Number of Pallets" name={"pallets_number"}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Number of PCs" name={"pcs_number"}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile} name="image_ref">
                            <Upload action="/upload.do" listType="picture-card">
                                <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
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