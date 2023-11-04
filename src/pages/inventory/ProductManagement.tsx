import { useEffect, useState } from "react";
import { Button, Space, Table, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getProductsWithStockBalance } from "../../services/ProductsAPI";
import { useAuthHeader } from "react-auth-kit";
import { IProductWithBalance } from "../../interfaces/Product";
const ProductManagement = () => {

    const authHeader = useAuthHeader();
    const [productsWithBalance, setProductWithBalance] = useState<IProductWithBalance[]>();

    const { data: products } = useQuery(
            ['products_balances'],
            () => getProductsWithStockBalance(authHeader())
    );

    console.log("Product balances:: ", products);

    useEffect(() => {

        if (products) {
            setProductWithBalance(products.data);
        }

    },[products]);

    const productColumns = [
        {
            title: 'Product',
            dataIndex: 'sku_name',
            key: 'sku_name',
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
            render: (_: any , record: any) => (record.stocks?.quantity),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: () => (
                <Space direction="horizontal">
                    <Tooltip title="Edit">
                        <Button shape="circle" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button shape="circle" icon={<DeleteOutlined />} danger/>
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div>
        <h1>Product Management</h1>
        <Space direction={"vertical"} style={{ display: 'flex' }}>
            <Button size={"large"} icon={<PlusOutlined />} type={"primary"}>Add New Product</Button>
            <Table 
                columns={ productColumns }
                dataSource={ productsWithBalance }
            />
        </Space>
        </div>
    );

}

export default ProductManagement;