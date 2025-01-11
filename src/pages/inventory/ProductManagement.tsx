import { useEffect, useState } from "react";
import { Alert, Button, Space, Table, Tooltip, Typography, Modal, Form, Input, Checkbox, InputNumber, message} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsWithStockBalance } from "../../services/ProductsAPI";
import { addProduct, updateProduct } from "../../services/ProductsAPI";
import { useAuthHeader } from "react-auth-kit";
import { IProduct, IProductWithBalance } from "../../interfaces/Product";

const { Search } = Input;

const ProductManagement = () => {

    const authHeader = useAuthHeader();
    const [messageApi, contextHolder ] = message.useMessage();
    const queryClient = useQueryClient()
    const [productsWithBalance, setProductWithBalance] = useState<IProductWithBalance[]>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    enum ProductMutationState {
        create, update
    }
    const [productMutationState, setProductMutationState] = useState<ProductMutationState>(ProductMutationState.create);
    const [checkIsReturnable, setCheckIsReturnable] = useState<boolean>(false);
    const [form] = Form.useForm()

    const { data: products, isLoading } = useQuery(
            ['products_balances'],
            () => getProductsWithStockBalance(authHeader())
    );

    const { mutate, isLoading: isMutating } = useMutation({
        mutationFn: (values: IProduct) => {
                if (productMutationState === ProductMutationState.create) 
                    return addProduct(values, authHeader());
                else
                if (values.id != undefined)
                    return updateProduct(values.id, values, authHeader()) 
                else 
                return new Promise((_, reject) => reject("Product ID is undefined"));
            },
            onSuccess: () => {
                form.resetFields();
                queryClient.invalidateQueries()
                setModalOpen(false);
                
                messageApi.destroy();
                messageApi.open({
                    type: 'success',
                    content: 'Product has been saved!',
                });

            }
        }
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
        
        if (productMutationState === ProductMutationState.create) {
            mutate({
                sku_name: form.getFieldValue("product_name"),
                sku_code: form.getFieldValue("sku_code"),
                empty_returnable: checkIsReturnable,
                retail_price: form.getFieldValue("retail_price"),
                wholesale_price: form.getFieldValue("wholesale_price"),
            } as IProduct)
        } else {

        mutate({
            id: productsWithBalance?.find((product) => product.sku_code === form.getFieldValue("sku_code"))?.id,
            sku_name: form.getFieldValue("product_name"),
            sku_code: form.getFieldValue("sku_code"),
            empty_returnable: checkIsReturnable,
            retail_price: form.getFieldValue("retail_price"),
            wholesale_price: form.getFieldValue("wholesale_price"),
        } as IProduct);

    }

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
            render: (_: any , record: any) => (record.inventory_balance?.quantity),
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
            {contextHolder}
            <Typography.Title level={2}>Product Management</Typography.Title>
            <Alert
            message="Help"
            description="This page shows the list of products, their prices and the stock balance. You can edit the prices when they change from the edit buttons."
            type="info"
            showIcon
            style={{marginBottom: 20}}
        />
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
                confirmLoading={isMutating}
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