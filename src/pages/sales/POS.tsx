import { Col, Row, List, Typography, Select, Form, Input, Divider, Button, Table } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { getAllProducts } from '../../services/ProductsAPI'
import { getCustomers } from '../../services/CustomersAPI'
import { useAuthHeader } from 'react-auth-kit'
import { ServerResponse } from '../../interfaces/Server'
import { IProduct } from '../../interfaces/Empties'
import { useEffect, useState } from 'react'
import { ICustomer } from '../../interfaces/Customer'
import FormItemLabel from 'antd/es/form/FormItemLabel'

const POS = () => {
    const authHeader = useAuthHeader();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [form] = Form.useForm();

    const { data: productsData } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products_all'],
        () => getAllProducts(authHeader())
    )

    const { data: customers } = useQuery<ServerResponse<ICustomer[]>, Error>(
        ['customers'],
        () => getCustomers(authHeader())
    )

    useEffect(() => {

        if (productsData) {
            console.log(productsData);
            setProducts(productsData.data)
        }

    },[productsData]);

    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };
      
    const onSearch = (value: string) => {
        console.log('search:', value);
    };

    const posTableColumns = [
        {
          title: 'SKU Code',
          dataIndex: 'sku_code',
          key: 'sku_code',
        },
        {
          title: 'Product',
          dataIndex: 'product',
          key: 'product',
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
          },
      ];


    return (
        <>
            <h1>Point of Sale</h1>

            <Row>
                <Col span={5} style={{border: 1, height: "65vh", overflow: 'scroll'}}>
                    <List
                        header={<strong>List of Products</strong>}
                        footer={<strong>Total: {products.length} products</strong>}
                        bordered
                        dataSource={products}
                        size="small"
                        renderItem={(item: IProduct, index: number) => (
                            <List.Item>
                                <Typography.Text>{index}</Typography.Text> {item.sku_name}
                            </List.Item>
                        )}
                    />
                </Col>

                <Col style={{marginLeft: "2rem"}}>
                    <div style={{
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderRadius: 10,
                        borderColor: "#D9D9D9",
                        backgroundColor: "#f3f1f1",
                        width: "45vw",
                    }}>
                        <Form
                            layout={'horizontal'}
                            form={form}
                            style={{ padding: "2rem"}}
                            labelCol={{ flex: '200px' }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{ flex: 1 }}

                        >
                            <Form.Item label="Choose Customer" name="product" style={{ marginBottom: "10px" }}>
                                <Select
                                    showSearch
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onSearch={onSearch}
                                    options={ [] }
                                    style={{width: "50%"}}
                                />
                            </Form.Item>
                            <Form.Item label="Select Product" name="product" style={{ marginBottom: "10px" }}>
                                <Select 
                                    showSearch
                                    placeholder="Find a Product"
                                    
                                />
                            </Form.Item>
                            <Divider></Divider>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Item label="Unit Price:" name="unit_price">
                                    <Input placeholder="Unit Price" />
                                </Form.Item>
                                <Form.Item label="Quantity Sold:" name="quantity">
                                    <Input placeholder="Quantity" />
                                </Form.Item>
                                <Form.Item label="Price">
                                    <Typography className="ant-form-text">0.00</Typography>
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <Button>Save</Button>
                                <Button>Clear</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderRadius: 10,
                        borderColor: "#D9D9D9",
                        height: "30vh",
                        marginTop: 10
                    }}>

                        <Table
                            columns={posTableColumns}
                        >

                        </Table>

                    </div>
                </Col>
                <Col span={5}>
                    <div style={{
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderRadius: 10,
                        borderColor: "#D9D9D9",
                        backgroundColor: "#BCBBBB",
                        marginLeft: 5,
                        height: "56vh",
                        width: "100%"
                    }}
                    >

                    </div>
                </Col>
            </Row>
        </>
    )
}

export default POS;