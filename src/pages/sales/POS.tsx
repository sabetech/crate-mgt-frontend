import { Space, Col, Row, List, Typography, InputNumber, Form, Input, Divider, Button, Table, AutoComplete, Select } from 'antd'
import { DeleteFilled } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../services/ProductsAPI'
import { getCustomers } from '../../services/CustomersAPI'
import { useAuthHeader } from 'react-auth-kit'
import { ServerResponse } from '../../interfaces/Server'
import { IProduct } from '../../interfaces/Product'
import { useEffect, useState } from 'react'
import { ICustomer } from '../../interfaces/Customer'

interface IPOSItem {
    id: number | undefined;
    sku_code: string;
    product: string;
    quantity: number;
    price: number;
}

const POS = () => {
    const authHeader = useAuthHeader();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [customer, setCustomer] = useState<ICustomer>();
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [selectedProduct, setSelectedProduct] = useState<IProduct>();
    const [tableContent, setTableContent] = useState<IPOSItem[]>([]); // [{sku_code: "sku_code", product: "product", quantity: 1, price: 0.00}]
    const [form] = Form.useForm();

    const { data: productsData } = useQuery<ServerResponse<IProduct[]>, Error>(
        ['products_all'],
        () => getProducts(authHeader(), { is_returnable: false })
    )

    const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
        ['customers'],
        () => getCustomers(authHeader(),{customer_type: 'all'})
    )

    useEffect(() => {

        if (productsData) {
            setProducts(productsData.data)
        }

    },[productsData]);

    useEffect(() => {

        if (tableContent) {
            setTotal(tableContent.reduce((acc, item) => acc + (item.quantity * item.price), 0));
        }

    },[tableContent])

    const onCustomerChange = (value: string, option: ICustomer) => {
        console.log(`selected Customer ${value}:::`, option);
        setCustomer(option)
    }

    const onProductChange = (value: string, option: IProduct) => {
        if (typeof option === 'undefined') {
            return;
        }
        
        setSelectedProduct(option);

        console.log(`selected Product ${value}:::`, option);
        form.setFieldValue("unit_price", option.retail_price);
        setUnitPrice(typeof option.retail_price === 'undefined' ? 0 : option.retail_price);
    };
      
    const onSearch = (value: string) => {
        console.log('searching ...:', value);
    };

    const savePurchase = () => {
        console.log("saving purchase ...");
        const product = selectedProduct;
        const quantity = form.getFieldValue("quantity");
        const unitPrice = form.getFieldValue("unit_price");
        const price = quantity * unitPrice;

        console.log("product: ", product);
        console.log("quantity: ", quantity);
        console.log("unitPrice: ", unitPrice);
        console.log("price: ", price);

        if (typeof product !== 'undefined') {
            setTableContent([{id: product.id, sku_code: product.sku_code, product: product.sku_name, quantity: quantity, price: price}, ...tableContent]);
        }

        form.resetFields();
        (unitPrice || unitPrice > 0) && setUnitPrice(0);
        form.setFieldValue("customer", customer?.name);

    }

    const removePOSItem = (record: any) => {
        console.log(record);
        setTableContent( (prev) => prev.filter((item) => item.id !== record.id) )
    }

    const posTableColumns = [
        {
            title: '# ('+(tableContent).length+')',
            dataIndex: 'index',
            key: 'index',
            render: (_: any , record: any) => (
                <Space size="middle" key={record.id}>     
                    <Typography.Text>{tableContent.indexOf(record) + 1}</Typography.Text>
                </Space>
            ),
            width: 80
          },
        {
          title: 'SKU Code',
          dataIndex: 'sku_code',
          key: 'sku_code',
          width: 100
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
            title: 'Price (GHC)',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any , record: any) => (
            <Space size="middle">     
                <Button shape="circle" danger icon={<DeleteFilled />} onClick={() => removePOSItem(record)}/>
            </Space>
    ),
        }
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
                                    value={`${customer?.name} (${customer?.customer_type.toUpperCase()})`}
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
                            <hr />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Item label={`Unit Price: ${typeof unitPrice === 'undefined'? "0.00" : unitPrice} GHC`} name="unit_price">
                                    <Input placeholder="Unit Price" value={unitPrice} readOnly/>
                                </Form.Item>
                                <Form.Item label="Quantity:" name="quantity">
                                    <InputNumber min={1} onChange={(val) => setQuantity( val === null ? 1 : val  )}/>
                                </Form.Item>
                                <Form.Item label="Price">
                                    <Typography className="ant-form-text">{unitPrice * quantity} GHC</Typography>
                                </Form.Item>
                            </div>
                            <Space wrap>
                                <Button size={"large"} type="primary" onClick={savePurchase}>Save</Button>
                                <Button size={"large"} onClick={() => form.resetFields()}>Clear</Button>
                            </Space>
                        </Form>
                    </div>
                    <div style={{
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderRadius: 10,
                        borderColor: "#D9D9D9",
                        height: "30vh",
                        marginTop: 10,
                        width: "45vw",
                    }}>

                        <Table
                            columns={posTableColumns}
                            dataSource={tableContent}
                            scroll={{ y: 250 }}
                            pagination={false}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        console.log("clicked row: ", record);
                                    }, // click row
                                    onMouseEnter: (event) => {}, // mouse enter row
                                    onMouseLeave: (event) => {}, // mouse leave row
                                  };
                            }}
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
                        width: "100%",
                    }}
                    >
                        <div style={{display: 'flex', flexDirection: 'column', marginTop: "1rem"}}>
                            <Divider orientation="left" >Purchase Summary</Divider>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                                <Typography.Text strong style={{marginRight: 10}}>Quantity: </Typography.Text>
                                <Typography.Text strong >{ tableContent.reduce((acc, item) => (acc + item.quantity), 0) }</Typography.Text>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                                <Typography.Text strong style={{marginRight: 10}}>Subtotal: </Typography.Text>
                                <Typography.Text strong>0.00 GHC</Typography.Text>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                                <Typography.Text strong style={{ fontSize: '1.5rem'}}>Total: </Typography.Text>
                                <Typography.Text strong style={{ fontSize: '1.5rem' }}>{ total.toFixed(2) } GHC</Typography.Text>
                            </div>
                            <Divider></Divider>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                                <Typography.Text strong style={{ fontSize: '1em'}}>Payment Type </Typography.Text>
                                <Select size={"large"} dropdownMatchSelectWidth={false} placement={'bottomRight'} defaultValue="Cash" options={[{value:"Cash", label: 'Cash'}, {value:"Mobile Money", label: 'Mobile Money'} ]} />
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem", marginTop: 10}}>
                                <Typography.Text strong style={{ fontSize: '1em'}}>Amount Tendered </Typography.Text>
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