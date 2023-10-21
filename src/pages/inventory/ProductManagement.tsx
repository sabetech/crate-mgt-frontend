import { Button, Space, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const ProductManagement = () => {

    const productColumns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'SKU Code',
            dataIndex: 'sku_code',
            key: 'sku_code',
        },
        {
            title: 'Wholesale Price',
            dataIndex: 'wholesale_price',
            key: 'wholesale_price',
        },
        {
            title: 'Retail Price',
            dataIndex: 'retail_price',
            key: 'retail_price',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ]

    return (
        <div>
        <h1>Product Management</h1>
        <Space direction={"vertical"} style={{ display: 'flex' }}>
            <Button size={"large"} icon={<PlusOutlined />} type={"primary"}>Add New Product</Button>
            <Table 
                columns={productColumns}
                dataSource={[]}
            />
        </Space>
        </div>
    );

}

export default ProductManagement;