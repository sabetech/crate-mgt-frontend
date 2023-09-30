import { Col, Row, List, Typography, Select, Form } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { getAllProducts } from '../../services/ProductsAPI'
import { useAuthHeader } from 'react-auth-kit'
import { ServerResponse } from '../../interfaces/Server'
import { IProduct } from '../../interfaces/Empties'
import { useEffect, useState } from 'react'

const POS = () => {
    const authHeader = useAuthHeader();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [form] = Form.useForm();

    const { data: productsData } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products_all'],
        () => getAllProducts(authHeader())
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


    return (
        <>
            <h1>Point of Sale</h1>

            <Row>
                <Col span={7} style={{border: 1, height: "50vh", overflow: 'scroll'}}>
                <List
                    header={<strong>List of Products</strong>}
                    footer={<strong>Total: {products.length} products</strong>}
                    bordered
                    dataSource={products}
                    renderItem={(item: IProduct, index: number) => (
                        <List.Item>
                            <Typography.Text>{index}</Typography.Text> {item.sku_name}
                        </List.Item>
                    )}
                />
                </Col>

                <Col style={{marginLeft: "5rem"}}>
                    <Row>
                        Customer: <Select
                                    showSearch
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onSearch={onSearch}
                                    options={[]}
                            />
                    </Row>
                    <Row>
                        <Form
                            layout={'horizontal'}
                            form={form}
                            
                        >
                            <Form.Item label="Select Product" name="product">
                                <Select 
                                    showSearch
                                    placeholder="Find a Product"
                                    options={[]}
                                />
                            </Form.Item>


                        </Form>
                    </Row>
                </Col>
            </Row>

        </>
    )
}

export default POS;