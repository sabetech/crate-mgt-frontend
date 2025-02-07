import { useState } from "react";
import { Typography, Divider, Select, Button, message } from "antd";
import { ISaleItem, IOrder } from "../../../../interfaces/Sale";
import dayjs from "dayjs";
import { ICustomer } from "../../../../interfaces/Customer";
import { useAuthHeader } from "react-auth-kit";
import { useSubmitPosOrder } from "../../hooks/salesHook";
import { PosMode } from "../../../../types/TSale";

type Props = {
    tableContent: ISaleItem[],
    customer: ICustomer | null | undefined
    orderDetails: {
        quantity: number,
        totalCost: number
    },
    posMode: PosMode
    
}

const OrderSummary:React.FC<Props> = ({tableContent, customer, orderDetails, posMode}) => {
    const [total, setTotal] = useState<number>(0);
    const [messageApi, contextHolder] = message.useMessage();
    const [paymentType, setPaymentType] = useState<string>("Cash");
    const authHeader = useAuthHeader();

    const { mutate: pay } = useSubmitPosOrder(authHeader)

    const saveSaleOrderAndPrint = () => {
        console.log("save and print:: ", posMode.toString());
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
            date: dayjs().format('YYYY-MM-DD'),
            posMode: posMode
        } as IOrder;

        messageApi.open({
            type: 'success',
            content: "Order successful"
        });
        
        pay(order); //either save and print or approving a sale by cashier
        posReset();
    }

    const saveLoadoutSubmit = () => {
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
            content: "Loadout successful"
        });
        
        pay(order); //either save and print or approving a sale by cashier
        posReset();

    }

    const resetStates = () => {
        // setTableContent([]);
        // setAmountTendered(0);
    }

    const posReset = () => {
        // resetStates();
        // formClear();
        
    }

    return (<>
            {contextHolder}
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
                    <Typography.Title level={5} style={{marginLeft: "1rem"}}>
                        {/* Customer: {location.state.customer.name}<br /> */}
                        {customer?.name}<br />
                    </Typography.Title>
                    <Typography.Title level={5} style={{marginLeft: "1rem"}}>
                                OrderID: <br />
                        <Typography.Text strong style={{marginLeft: "1rem"}}>{"N/A"}</Typography.Text>
                    </Typography.Title>
                    <Divider orientation="left" >Summary</Divider>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                        <Typography.Text strong style={{marginRight: 10}}>Quantity: </Typography.Text>
                        <Typography.Text strong >{ orderDetails.quantity }</Typography.Text>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                        <Typography.Text strong style={{marginRight: 10}}>Subtotal: </Typography.Text>
                        <Typography.Text strong>{orderDetails.totalCost} GHC</Typography.Text>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                        <Typography.Text strong style={{ fontSize: '1.5rem'}}>Total: </Typography.Text>
                        <Typography.Text strong style={{ fontSize: '1.5rem' }}>{ orderDetails.totalCost.toFixed(2) } GHC</Typography.Text>
                    </div>
                    <Divider></Divider>
                    {posMode === PosMode.sale &&
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: "1rem", marginLeft: "1rem"}}>
                        <Typography.Text strong style={{ fontSize: '1em'}}>Payment Type </Typography.Text>
                        <Select size={"large"} dropdownMatchSelectWidth={false} placement={'bottomRight'} defaultValue={paymentType} options={[
                            {value:"cash", label: 'Cash'}, 
                            {value:"mobile-money", label: 'Mobile Money'},
                            {value:"cheque", label: 'Cheque'},
                            {value:"bank-transfer", label: 'Bank Transfer'}
                            ]} onChange={(value) =>setPaymentType(value)}/>
                    </div>
}
                    <div style={{display: 'flex', justifyContent:'center'}}>
                        {
                            // location.state !== null // if location.state is not null, then we are in POS mode because an order has been made
                            // ? (<Button type="primary" size="large" style={{width: "90%", marginTop: "1rem"}} onClick={handlePay} disabled={amountTendered < total || total === 0}>Pay</Button>) 
                            // :

                            posMode === PosMode.sale ?
                            <Button type="primary" size="large" style={{width: "90%", marginTop: "1rem"}} onClick={saveSaleOrderAndPrint} disabled={orderDetails.totalCost === 0}>Save and Print</Button>
                            :
                            posMode === PosMode.loadout ?
                            <Button type="primary" size="large" style={{width: "90%", marginTop: "1rem"}} onClick={saveSaleOrderAndPrint} disabled={orderDetails.totalCost === 0}>Save Loadout</Button>
                            :
                            posMode === PosMode.loadout_return ?
                            <Button type="primary" size="large" style={{width: "90%", marginTop: "1rem"}} onClick={saveSaleOrderAndPrint} disabled={orderDetails.totalCost === 0}>Submit VSE Returns</Button>
                            :
                            posMode === PosMode.customer_sale_update &&
                            <Button type="primary" size="large" style={{width: "90%", marginTop: "1rem"}} onClick={saveSaleOrderAndPrint} disabled={orderDetails.totalCost === 0}>Customer Sale Returns</Button>
                        }
                    </div>

                </div>

            </div>
        
    </>)
}

export default OrderSummary;