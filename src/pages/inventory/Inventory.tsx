import { useState } from 'react';
import { Card, Statistic, Table, Space, Typography, Button, Modal, Form, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddProductQuantityFields from '../../components/AddProductQuantityFields';

const Inventory = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    //Handle Modal Okay
    const handleOk = () => {

    }

    

    const columns = [
        {
          title: 'Product',
          dataIndex: 'product',
          key: 'product',
        },
        {
          title: 'Opening Stock',
          dataIndex: 'opening_stock',
          key: 'opening_stock',
        },
        {
            title: 'Pending Orders (office)',
            dataIndex: 'pending_orders',
            key: 'pending_orders',
        },
        {
          title: 'Orders (Office)',
          dataIndex: 'orders',
          key: 'orders',
        },
        {
            title: 'Received from GGBL',
            dataIndex: 'received',
            key: 'received',
        },
        {
            title: 'Loadouts',
            dataIndex: 'loadouts',
            key: 'loadouts',
        },
        {
            title: 'Returns by VSEs',
            dataIndex: 'returns',
            key: 'returns',
        },
        {
            title: 'Breakages',
            dataIndex: 'breakages',
            key: 'breakages',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
        },
      ];

    function onChange(date: any, dateString: any) {
        console.log(date, dateString);
    }

    return (
        <>
            <Typography.Title level={2}>Stock Balances</Typography.Title>
            <Space direction={"vertical"}>
            <Button size={"large"} icon={<PlusOutlined />} type={"primary"} onClick={() => setModalOpen(true)}>Sales In</Button>
                <Space direction={"horizontal"}>
                    <Typography.Text>Select Date</Typography.Text> <DatePicker onChange={onChange} />
                </Space>
            </Space>
            
            <Card title="Opening Stock as at {{ date }}" bordered={false}>
                <Statistic 
                    value={1230}
                    valueStyle={{ color: '#3f8600' }}
                />
            </Card>

            <Table 
                columns={columns}
            />
            <Modal
                title="New stock From GGBL"
                open={modalOpen}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={() => setModalOpen(false)}
                width={800}
            >
                <Form
                    form={form}
                >
                    <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                        <DatePicker size={'large'}/>
                    </Form.Item>
                    <AddProductQuantityFields name={"products_from_ggbl"} is_returnable={false} />
                    <AddProductQuantityFields name={"breakages_from_ggbl"} is_returnable={false} />
                </Form>
            </Modal>
        </>
    )
}

export default Inventory;