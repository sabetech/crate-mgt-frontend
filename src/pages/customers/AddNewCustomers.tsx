import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { Form, Input, Select, Button, message, Spin, Modal, Space, Alert, Upload } from "antd";
import type { UploadProps } from 'antd';
import { useMutation } from "@tanstack/react-query";
import { addCustomer } from "../../services/CustomersAPI";
import { useAuthHeader } from "react-auth-kit";
import { AppError } from "../../interfaces/Error";
import { Loading3QuartersOutlined, InboxOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const antIcon = <Loading3QuartersOutlined style={{ fontSize: 24, marginRight: 10 }} spin />;
const AddNewCustomers: React.FC = () => {
    const [form] = useForm();
    const authHeader = useAuthHeader();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [importModalOpen, setImportModalOpen] = useState<boolean>(false);

    const { mutate, isLoading: isSubmitting } = useMutation({
        mutationFn: (values: any) => addCustomer(values, authHeader()),
        onSuccess: (data) => {
            success(data?.data || "")
            navigate("/customers/list_all_customers")
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
        messageApi.open({
          type: 'success',
          content: msg,
        });
        setTimeout(messageApi.destroy, 2500);
    }
    
    const onFinish = (_values: any) => {
        console.log(_values);
        mutate(_values);
    }

    const toggleImportCustomersModal = () => {
        setImportModalOpen(!importModalOpen);
    }

    return (
        <>
            {contextHolder}
            <Button size="large" style={{float:"right"}} onClick={() => toggleImportCustomersModal()}>Import Customer from Excel</Button>

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
                        <Option value="retailer-vse">Retailer(VSE)</Option>
                    </Select>
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                    {isSubmitting && <Spin indicator={antIcon} />} Submit
                    </Button>
                </Form.Item>

            </Form>
            <Modal
                title="Import Customers from Excel"
                style={{ top: 20 }}
                open={importModalOpen}
                onOk={() => setImportModalOpen(false)}
                onCancel={() => setImportModalOpen(false)}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert
                        message="Success Tips"
                        description={<p>Download this <a href="#" download="Sample Import Excel" target="_blank" rel="noreferrer">sample Excel</a> and fill it up with your customers."</p>}
                        type="success"
                        showIcon
                    />

                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                    </p>
                </Dragger>

                </Space>
            </Modal>
        </>
    )

}

export default AddNewCustomers;