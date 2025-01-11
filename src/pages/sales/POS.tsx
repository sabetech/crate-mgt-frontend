import { Alert,Checkbox, message, Space, Col, Row, List, Typography, InputNumber, Form, Input, Divider, Button, Table, AutoComplete, Select, Badge} from 'antd'
import { DeleteFilled } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query'
import { getProductsWithStockBalance } from '../../services/ProductsAPI'
import { getCustomersWithBalance } from '../../services/CustomersAPI'
import { useAuthHeader } from 'react-auth-kit'
import { ServerResponse } from '../../interfaces/Server'
import { IProductWithBalance } from '../../interfaces/Product'
import { useEffect, useState } from 'react'
import { ICustomer, ICustomerReturnEmpties } from '../../interfaces/Customer'
import { pay, printReceipt as print } from '../../services/SalesAPI'
import { IOrder, ISaleItem } from '../../interfaces/Sale';
import dayjs from 'dayjs';
import {useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as constants from "../../utils/constants";
import "./sales.css";


const POS = () => {
    const authHeader = useAuthHeader();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [products, setProducts] = useState<IProductWithBalance[]>([]);
    const [customer, setCustomer] = useState<ICustomer>(location.state?.customer as ICustomer);
    const [emptiesBalance, setEmptiesBalance] = useState<number>(0);
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [amountTendered, setAmountTendered] = useState<number>(0);
    const [paymentType, setPaymentType] = useState<string>("Cash");
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedProduct, setSelectedProduct] = useState<IProductWithBalance | undefined>();
    const [tableContent, setTableContent] = useState<ISaleItem[]>(location.state?.sales ?? []); // [{sku_code: "sku_code", product: "product", quantity: 1, price: 0.00}]
    const [form] = Form.useForm();

    const { data: productsData } = useQuery<ServerResponse<IProductWithBalance[]>, Error>(
        ['products_all'],
        () => getProductsWithStockBalance(authHeader())
    );

    const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
        ['customers'],
        () => getCustomersWithBalance(authHeader(), { customer_type: 'all'} )
    )

    const { mutate: printAction } = useMutation({
        mutationFn: (values: IOrder) => {
            return print(values)
        },
        onSuccess: (data) => {
            console.log("data: ", data);
    
        },
    });

    const { mutate } = useMutation({
        mutationFn: (values: IOrder) => {
            return pay(authHeader(), values)
        },
        onSuccess: (data: any, orderDetails: IOrder) => {
            orderDetails.transaction_id = data.data.transaction_id
            console.log("order details: ", orderDetails);
            printAction(orderDetails);
            if (location.state) navigate("/POS/orders");

            form.resetFields();
        },
        onError: (error: Error) => {
            console.log("error: ", error);
            messageApi.open({
                type: 'error',
                content: error.message + ". Please Check your internet connection and refresh the page."
            });
            setTimeout(messageApi.destroy, 2500);
        }
    });

    


    useEffect(() => {

        if (productsData) {
            setProducts(productsData.data)
        }

    },[productsData]);

    useEffect(() => {

        if (tableContent) {
            setTotal(tableContent.reduce((acc, item) => acc + (item.quantity * (item.product.retail_price ?? 0)), 0));
        }

    },[tableContent])

    useEffect(() => {
        if (customer) {
            if (typeof customer.customer_empties_account === 'undefined') {
                setEmptiesBalance(0);
                return
            }

            const emptiesBalance = customer.customer_empties_account.reduce((acc: number, customerEmptiesInfo: ICustomerReturnEmpties) => {
                if (customerEmptiesInfo.transaction_type === 'in')
                    return acc + customerEmptiesInfo.quantity_transacted;
                return acc - customerEmptiesInfo.quantity_transacted;
            }, 0);
            
            setEmptiesBalance(emptiesBalance);
        }else {
            setEmptiesBalance(0);
        }
    }, [customer]);

    const onCustomerChange = (_: string, option: ICustomer) => {
        setCustomer(option)

        if (option.customer_type === 'wholesaler') {
            form.setFieldValue("unit_price", selectedProduct?.wholesale_price);
            setUnitPrice(typeof selectedProduct?.wholesale_price === 'undefined' ? 0 : selectedProduct?.wholesale_price);
        }else {
            form.setFieldValue("unit_price", selectedProduct?.retail_price);
            setUnitPrice(typeof selectedProduct?.retail_price === 'undefined' ? 0 : selectedProduct?.retail_price);
        }
    }

    const [_, setVSECustomer] = useState<ICustomer|undefined>(undefined)
    const onVseChange = (_: string, option: ICustomer) => {
        setVSECustomer(option)
    }

    const onProductChange = (_: string, option: IProductWithBalance) => {
        if (typeof option === 'undefined') {
            return;
        }
        
        setSelectedProduct(option);
        
        if (customer && customer.customer_type === 'wholesaler') {
            form.setFieldValue("unit_price", option.wholesale_price);
            setUnitPrice(typeof option.wholesale_price === 'undefined' ? 0 : option.wholesale_price);
        }else{
            form.setFieldValue("unit_price", option.retail_price);
            setUnitPrice(typeof option.retail_price === 'undefined' ? 0 : option.retail_price);
        }
        
    };
      
    const onSearch = (value: string) => {
        console.log('searching ...:', value);
    };

    const formClear = () => {
        form.resetFields();
        setUnitPrice(0);
        setQuantity(1);
        setSelectedProduct(undefined);
    }

    const savePurchase = () => {

        if (!selectedProduct || typeof selectedProduct === 'undefined' || typeof form.getFieldValue("product") === 'undefined') {
            messageApi.open({
                type: 'error',
                content: "Please select a product"
            });
            return;
        }

        if (typeof form.getFieldValue("quantity") === 'undefined') {
            messageApi.open({
                type: 'error',
                content: "Please enter a quantity"
            });
            return;
        }

        const product = selectedProduct;
        const quantity = form.getFieldValue("quantity");
        const unitPrice = form.getFieldValue("unit_price");

        if (!customer) {
            messageApi.open({
                type: 'error',
                content: "Please Choose a customer!"
            });
            return;
        }

        if (product.empty_returnable && customer.customer_type !== 'wholesaler') {
            if (emptiesBalance < quantity) { 
                messageApi.open({
                    type: 'error',
                    content: "Customer does not have enough empties to make this purchase"
                });
                return;
            }
        }

        if (typeof product !== 'undefined') {
            setTableContent([{id: product.id, product: product, quantity: quantity, key: product.id} as ISaleItem, ...tableContent]);
        }

        if (product.empty_returnable) updateCustomerEmptiesBalance(-quantity);

        form.resetFields();
        (unitPrice || unitPrice > 0) && setUnitPrice(0);
        form.setFieldValue("customer", `${customer?.name} (${customer?.customer_type.toUpperCase()})`);

    }

    const updateCustomerEmptiesBalance = (quantity: number) => {
        setEmptiesBalance((prev) => prev + quantity)
    }

    const removePOSItem = (record: ISaleItem) => {
        setTableContent( (prev) => prev.filter((item) => item.id !== record.id) )
        if (record.product.empty_returnable) updateCustomerEmptiesBalance(record.quantity);
    }

    const saveAndPrint = () => {
        console.log("save and print");
        const saleItems = tableContent.map((item) => ({
            key: item.id,
            product: item.product,
            quantity: item.quantity,
        } as ISaleItem));

        console.log("saleItems: ", saleItems)

        const order = {
            paymentType: paymentType,
            customer: customer,
            saleItems: saleItems,
            total: total,
            amountTendered: 0,
            balance: -total,
            date: dayjs().format('YYYY-MM-DD')
        } as IOrder;

        messageApi.open({
            type: 'success',
            content: "Order successful"
        });
        mutate(order);
        posReset();
    }

    const handlePay = () => {
        if (amountTendered < total) {
            messageApi.open({
                type: 'error',
                content: "Amount tendered is less than total"
            });
            return;
        }

        const saleItems = tableContent.map((item) => ({
            key: item.id,
            product: item.product,
            quantity: item.quantity,
        } as ISaleItem));

        const order = {
            paymentType: paymentType,
            customer: customer,
            saleItems: saleItems,
            total: total,
            amountTendered: amountTendered,
            balance: amountTendered - total,
            date: dayjs().format('YYYY-MM-DD'),
            order_transaction_id: location.state?.transaction_id
        } as IOrder;

        mutate(order);

        messageApi.open({
            type: 'success',
            content: "Payment successful"
        });

    }

    const resetStates = () => {
        setTableContent([]);
        setAmountTendered(0);
    }

    const posReset = () => {
        resetStates();
        formClear();
        
    }

    const onProductClicked = (product: IProductWithBalance) => {
        onProductChange(product.sku_name, product);
    }

    const [isVseAssistedSale, setIsVSEAssistedSale] = useState<boolean>(false);
    const onCheckedVSEAssistedSale = ( e: { target: { checked: boolean; }; } ) => {
        setIsVSEAssistedSale(e.target.checked)
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
          width: 100,
          render: (_: any , record: ISaleItem) => record.product.sku_code.toUpperCase(),
        },
        {
          title: 'Product',
          dataIndex: 'product',
          key: 'product',
          render: (_: any , record: ISaleItem) => record.product.sku_name,
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
            render: (_: any , record: ISaleItem) => record.product.retail_price && record.product.retail_price,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any , record: ISaleItem) => (
            <Space size="middle">     
                <Button shape="circle" danger icon={<DeleteFilled />} onClick={() => removePOSItem(record)}/>
            </Space>
    ),
        }
    ];

    useEffect(() => {

        form.setFieldValue("product", selectedProduct?.sku_name);

    },[selectedProduct])

    return (
        <>
            {contextHolder}
            <Typography.Title level={2}> {!location.state ? "Point of Sale" : "Order Checkout"}</Typography.Title>
            <Alert
                message="Help"
                description="On the POS page, you cam sell products here based on what the customer wants. 
                            If it's a retailer, the customer will not be allowed to purchase 
                            if they don't have enough empties. Search for the product you want to sell and the quantity. Hit save. 
                            When you are done, click on Save and Print. If the receipt is not printing, contact support."
                type="info"
                showIcon
                style={{marginBottom: 20}}
            />
            <Row>
                {!location.state &&
                <Col span={5} style={{border: 1, height: "65vh", overflow: 'scroll'}}>
                    <List
                        header={<strong>List of Products </strong>}
                        footer={"Oppong Kyekyeku LTD"}
                        bordered
                        dataSource={products}
                        size="small"
                        renderItem={(item: IProductWithBalance, index: number) => 
                            { 
                                return (item.inventory_balance != null && item.inventory_balance.quantity > 0) ?
                                            (<List.Item style={{cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => onProductClicked(item)}>
                                                <Typography.Text>{index + 1} {item.sku_name}</Typography.Text>
                                                <Badge showZero count={(item.inventory_balance != null) ? item.inventory_balance.quantity : 0 } color={(item.inventory_balance != null) ? (item.inventory_balance.quantity > 40) ? "green": (item.inventory_balance.quantity > 22 ? "gold" : "red") : 'red' } />
                                            </List.Item>
                                        ) :
                                        (   <List.Item style={{display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography.Text style={{color: '#d3d3d3'}}>{index + 1} {item.sku_name}</Typography.Text>
                                                <Badge showZero count={(item.inventory_balance != null) ? item.inventory_balance.quantity : 0 } color={(item.inventory_balance != null) ? (item.inventory_balance.quantity > 40) ? "green": (item.inventory_balance.quantity > 22 ? "gold" : "red") : 'red' } />
                                            </List.Item>
                                        )
                            }
                        }
                    />
                </Col>
                }

                <Col style={{marginLeft: "1rem"}}>
                    
                        
                        { !location.state &&
                        <Badge.Ribbon text={`Empties Balance: ${emptiesBalance}`} color={emptiesBalance > 0 ? "green" : "red"}>
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
                                    onSelect={(text: string, option: ICustomer) => onCustomerChange(text, option)}
                                    placeholder="Search for Customer"
                                    options={ customersResponse?.data.map(custmr => ({...custmr, value: `${custmr.name} (${custmr.customer_type.toUpperCase()})`})) }
                                    filterOption={(inputValue, option) =>
                                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                />
                            </Form.Item>
                            <Checkbox onChange={onCheckedVSEAssistedSale} style={{ marginBottom: "10px" }}>VSE Assisted Sale</Checkbox>
                            {
                            isVseAssistedSale && 
                                <Form.Item label="Select VSE" style={{ marginBottom: "10px" }}>
                                    <AutoComplete 
                                    allowClear={true}
                                    bordered={false}
                                    onSelect={(text: string, option: ICustomer) => onVseChange(text, option)}
                                    placeholder="Search for VSE"
                                    options={ customersResponse?.data.map(custmr => ({...custmr, value: `${custmr.name} (${custmr.customer_type.toUpperCase()})`})).filter(custmr => custmr.customer_type === constants.RETAILER_VSE) }
                                    filterOption={(inputValue, option) =>
                                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                />
                                </Form.Item>
                            }
                            
                                
                                <Form.Item label="Select Product" name="product" style={{ marginBottom: "10px" }} >
                                    <AutoComplete 
                                        allowClear={true}
                                        onClear={() => {
                                            setUnitPrice(0);
                                            setQuantity(1);
                                            setSelectedProduct(undefined);
                                            form.setFieldValue('unit_price', 0)
                                        }}
                                        bordered={false}
                                        onSearch={onSearch}
                                        onSelect={(text: string, option: any) => onProductChange(text, option)}
                                        placeholder="Search for Product"
                                        options={productsData?.data.map(prdt => ({...prdt, value: `${prdt.sku_name} (${prdt?.inventory_balance?.quantity ?? 0})` })).filter(prdt => prdt?.inventory_balance?.quantity > 0)}
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
                                    <Form.Item name={"unit_price"} label={`Unit Price: ${typeof unitPrice === 'undefined'? "0.00" : unitPrice} GHC`}>
                                        <Input placeholder="Unit Price" value={unitPrice} readOnly/>
                                    </Form.Item>
                                    <Form.Item label="Quantity:" name="quantity">
                                        <InputNumber min={1} onChange={(val) => setQuantity( val === null ? 1 : val  )}/>
                                    </Form.Item>
                                    <Form.Item label="Price">
                                        <Typography className="ant-form-text">{(unitPrice * quantity).toFixed(2)} GHC</Typography>
                                    </Form.Item>
                                </div>
                                <Space wrap>
                                    <Button size={"large"} type="primary" onClick={savePurchase} disabled={(typeof selectedProduct === 'undefined') } >Save</Button>
                                    <Button size={"large"} onClick={() => formClear()}>Clear</Button>
                                </Space>
                            </Form>
                        </div>
                        </Badge.Ribbon>
                        }
                        
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
                                onRow={(record, _) => {
                                    return {
                                        onClick: () => {
                                            console.log("clicked row: ", record);
                                        }, // click rowon
                                        // onMouseEnter: (event) => {}, // mouse enter row
                                        // onMouseLeave: (event) => {}, // mouse leave row
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
                            {
                                location.state &&
                                <Typography.Title level={5} style={{marginLeft: "1rem"}}>
                                    Customer: {location.state.customer.name}<br />
                                </Typography.Title>
                            }
                            <Typography.Title level={5} style={{marginLeft: "1rem"}}>
                                OrderID: <br />
                            <Typography.Text strong style={{marginLeft: "1rem"}}>{location.state?.transaction_id}</Typography.Text>
                            </Typography.Title>
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
                                <Select size={"large"} dropdownMatchSelectWidth={false} placement={'bottomRight'} defaultValue={paymentType} options={[
                                    {value:"cash", label: 'Cash'}, 
                                    {value:"mobile-money", label: 'Mobile Money'},
                                    {value:"cheque", label: 'Cheque'},
                                    {value:"bank-transfer", label: 'Bank Transfer'}
                                    ]} onChange={(value) =>setPaymentType(value)}/>
                            </div>

                            {
                                location.state !== null &&
                                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem", marginTop: 10}}>
                                    <Typography.Text strong style={{ fontSize: '1em'}}>Amount Tendered </Typography.Text>
                                    <InputNumber size="large" style={{width: '50%'}} placeholder='0.00' addonAfter="GHs" value={amountTendered} onChange={(val) => val && setAmountTendered(val)}/>
                                </div>
                            }
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem", marginTop: 10}}>
                                {
                                    location.state !== null &&
                                    <>
                                        <Typography.Text strong style={{ fontSize: '1em'}}>Balance </Typography.Text>
                                        <Typography.Text strong style={{ fontSize: '1em' }}>{ amountTendered - total } GHs</Typography.Text>
                                    </>
                                }
                            </div>

                            <div style={{display: 'flex', justifyContent:'center'}}>
                                {
                                    location.state !== null // if location.state is not null, then we are in POS mode because an order has been made
                                    ? (<Button type="primary" size="large" style={{width: "90%", marginTop: "1rem"}} onClick={handlePay} disabled={amountTendered < total || total === 0}>Pay</Button>) 
                                    :
                                    (<Button type="primary" size="large" style={{width: "90%", marginTop: "1rem"}} onClick={saveAndPrint} disabled={total === 0}>Save and Print</Button>)

                                }
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default POS;