import { Col, Row, List, Typography, InputNumber, Form, Input, Divider, Button, Table, AutoComplete } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { getAllProducts } from '../../services/ProductsAPI'
import { getCustomers } from '../../services/CustomersAPI'
import { useAuthHeader } from 'react-auth-kit'
import { ServerResponse } from '../../interfaces/Server'
import { IProduct } from '../../interfaces/Product'
import { useEffect, useState } from 'react'
import { ICustomer } from '../../interfaces/Customer'

const POS = () => {
    const authHeader = useAuthHeader();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [tableContent, setTableContent] = useState<IProduct[]>([]); // [{sku_code: "sku_code", product: "product", quantity: 1, price: 0.00}]
    const [form] = Form.useForm();

    const { data: productsData } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products_all'],
        () => getAllProducts(authHeader())
    )

    const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
        ['customers'],
        () => getCustomers(authHeader())
    )

    useEffect(() => {

        if (productsData) {
            setProducts(productsData.data)
        }

    },[productsData]);

    useEffect(() => {



    },[unitPrice, quantity])

    const onCustomerChange = (value: string, option: ICustomer) => {
        console.log(`selected Customer ${value}:::`, option);

    }

    const onProductChange = (value: string, option: IProduct) => {
        console.log(`selected Product ${value}:::`, option);
        form.setFieldValue("unit_price", option.retail_price);
        setUnitPrice(typeof option.retail_price === 'undefined' ? 0:option.retail_price);
    };

    const onUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumber = parseFloat(e.target.value || '0');
        if (Number.isNaN(newNumber)) {
            return;
        }
        setUnitPrice(newNumber)
      };
      
    const onSearch = (value: string) => {
        console.log('searching ...:', value);
    };

    const savePurchase = () => {
        console.log("saving purchase ...");
        const product = form.getFieldValue("")


    }

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

                <Col style={{marginLeft: "1rem"}}>
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
                            initialValues={{
                                'quantity': 1
                            }}

                        >
                            <Form.Item label="Choose Customer" name="customer" style={{ marginBottom: "10px" }}>
                                <AutoComplete 
                                    allowClear={true}
                                    bordered={false}
                                    onSearch={onSearch}
                                    onChange={(text: string, option: any) => onCustomerChange(text, option)}
                                    placeholder="Search for Customer"
                                    options={ customersResponse?.data.map(custmr => ({...custmr, value: `${custmr.name} (${custmr.customer_type.toUpperCase()})`})) }
                                    filterOption={(inputValue, option) =>
                                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                      }
                                />
                            </Form.Item>
                            <Form.Item label="Select Product" name="product" style={{ marginBottom: "10px" }}>
                                <AutoComplete 
                                    allowClear={true}
                                    bordered={false}
                                    onSearch={onSearch}
                                    onChange={(text: string, option: any) => onProductChange(text, option)}
                                    placeholder="Search for Product"
                                    options={productsData?.data.map(prdt => ({...prdt, value: prdt.sku_name}))}
                                    filterOption={(inputValue, option) =>
                                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                      }
                                />
                            </Form.Item>
                            <Divider></Divider>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Item label={`Unit Price: ${typeof unitPrice === 'undefined'? "0.00" : unitPrice} GHC`} name="unit_price">
                                    <Input placeholder="Unit Price" onChange={(val) => onUnitPriceChange(val)} value={unitPrice}/>
                                </Form.Item>
                                <Form.Item label="Quantity:" name="quantity">
                                    <InputNumber min={1} onChange={(val) => setQuantity( val === null ? 1 : val  )}/>
                                </Form.Item>
                                <Form.Item label="Price">
                                    <Typography className="ant-form-text">{unitPrice * quantity} GHC</Typography>
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <Button type="primary" ghost onClick={savePurchase}>Save</Button>
                                <Button >Clear</Button>
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
                        backgroundColor: "#F5F5F5FF",
                        marginLeft: 5,
                        paddingBottom: 35,
                        // height: "56vh",
                        width: "100%",
                    }}
                    >
                        <div style={{display: 'flex', flexDirection: 'column', marginTop: "1rem"}}>
                            <Divider orientation="left" >Purchase Summary</Divider>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                                <Typography.Text strong style={{marginRight: 10}}>Quantity: </Typography.Text>
                                <Typography.Text strong >0</Typography.Text>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                                <Typography.Text strong style={{marginRight: 10}}>Subtotal: </Typography.Text>
                                <Typography.Text strong>0.00 GHC</Typography.Text>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                                <Typography.Text strong style={{ fontSize: '1.5rem'}}>Total: </Typography.Text>
                                <Typography.Text strong style={{ fontSize: '1.5rem' }}>0.00 GHC</Typography.Text>
                            </div>
                            <Divider></Divider>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                                <Typography.Text strong style={{ fontSize: '1em'}}>Payment Type </Typography.Text>
                                <Typography.Text strong style={{ fontSize: '1em' }}>Cash</Typography.Text>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                                <Typography.Text strong style={{ fontSize: '1em', marginTop: 10}}>Amount Tendered </Typography.Text>
                                <InputNumber size="large" style={{width: '50%'}} placeholder='0.00' addonAfter="GHC" />
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem", marginTop: 10}}>
                                <Typography.Text strong style={{ fontSize: '1em'}}>Balance </Typography.Text>
                                <Typography.Text strong style={{ fontSize: '1em' }}>0.00</Typography.Text>
                            </div>

                            <div style={{display: 'flex', justifyContent:'center'}}>
                                <Button type="primary" size="large" style={{width: "90%", marginTop: "1rem"}}>Pay</Button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default POS;