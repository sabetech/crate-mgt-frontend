import { useEffect, useState } from "react";
import { Button, Space, Table, Tooltip, Typography, Modal, Form, Input, Checkbox, InputNumber} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getProductsWithStockBalance } from "../../services/ProductsAPI";
import { useAuthHeader } from "react-auth-kit";
import { IProductWithBalance } from "../../interfaces/Product";

const { Search } = Input;

const ProductManagement = () => {

    const authHeader = useAuthHeader();
    const [productsWithBalance, setProductWithBalance] = useState<IProductWithBalance[]>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    enum ProductMutationState {
        create, update
    }
    const [productMutationState, setProductMutationState] = useState<ProductMutationState>(ProductMutationState.create);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [checkIsReturnable, setCheckIsReturnable] = useState<boolean>(false);
    const [form] = Form.useForm()

    const { data: products, isLoading } = useQuery(
            ['products_balances'],
            () => getProductsWithStockBalance(authHeader())
    );

    const onSearch = (searchTerm: string) => {
        if (searchTerm.length === 0) {
            setProductWithBalance(products?.data.map((product) => ({...product, key: product.id})));
            return;
        }

        const filteredProducts = productsWithBalance?.filter((product) => product.sku_name.toLowerCase().includes(searchTerm.toLowerCase()));
        setProductWithBalance(filteredProducts);
    }
        
    const handleOk = () => {

    }


    const handleEditClick = (product: IProductWithBalance) => {
        form.setFieldValue("product_name", product.sku_name);
        form.setFieldValue("sku_code", product.sku_code);
        setCheckIsReturnable(product?.empty_returnable ?? false);
        form.setFieldValue("retail_price", product.retail_price);
        form.setFieldValue("wholesale_price", product.wholesale_price);
        setProductMutationState(ProductMutationState.update);
        setModalOpen(true);
    }

    useEffect(() => {

        if (products) {
            setProductWithBalance(products.data.map((product) => ({...product, key: product.id})));
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
            render: (_:any, record: IProductWithBalance) => (
                <Space direction="horizontal">
                    <Tooltip title="Edit">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => handleEditClick(record) }/>
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
            <Typography.Title level={2}>Product Management</Typography.Title>
            <Space direction={"vertical"} style={{ display: 'flex' }}>
                <Space direction={"horizontal"} style={{ marginBottom: "2rem" }}>
                <Search
                        placeholder="Search for product"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                    />
                    <Button size={"large"} icon={<PlusOutlined />} type={"primary"} 
                        onClick={() => 
                        {
                            ProductMutationState.create 
                            setModalOpen(true)
                        }}>
                        Add New Product
                    </Button>
                    
                </Space>
                <Table 
                    columns={ productColumns }
                    dataSource={ productsWithBalance }
                    loading={ isLoading }
                />
            </Space>
            <Modal 
                title={productMutationState === ProductMutationState.create ? "Add New Product" : "Edit Product"}
                open={modalOpen}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={() => setModalOpen(false)}
                
                >
                    <Form
                        form={form}
                        layout={'vertical'}
                    >
                        <Form.Item label="SKU Name" name="product_name" rules={[{ required: true }]}>
                            <Input size={'large'}/>
                        </Form.Item>
                        <Form.Item label="SKU Code" name="sku_code" rules={[{ required: true }]}>
                            <Input size={'large'}/>
                        </Form.Item>
                        <Form.Item label="Is Returnable?" name="is_returnable">
                            <Checkbox checked={checkIsReturnable}/>
                        </Form.Item>
                        <Form.Item label="Retail Price" name="retail_price" rules={[{ required: true }]}>
                            <InputNumber addonAfter="GHc" size={'large'}/>
                        </Form.Item>
                        <Form.Item label="Wholesale Price" name="wholesale_price" rules={[{ required: true }]}>
                            <InputNumber addonAfter="GHc" size={'large'}/>
                        </Form.Item>
                    </Form>
            </Modal>
        </div>
    );

}

export default ProductManagement;