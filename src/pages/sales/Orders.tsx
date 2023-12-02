import { useState, useEffect } from "react";
import { IOrder } from "../../interfaces/Sale";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/SalesAPI";
import { useAuthHeader } from "react-auth-kit";
import { Typography, Table, Tag, Button, Space } from "antd";
import { ServerResponse } from "../../interfaces/Server";
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const authHeader = useAuthHeader();
    const navigate = useNavigate();

    const { data: ordersData } = useQuery<ServerResponse<IOrder[]>, Error>(
        ["orders"],
        () => getOrders(authHeader()),
    );
    
    useEffect(() => {

        if (ordersData) {
            setOrders(ordersData.data)
        }

    }, [ordersData]);

    const onCheckout = (order: IOrder) => {
        console.log("Checkout::", order);
        navigate(`/POS/Sales`, { state: order as IOrder })
    }

    const columns = [
        {
            title: "Order Date",
            dataIndex: "date",
            key: "order_date"

        },
        {
            title: "Order ID", 
            dataIndex: "transaction_id",
            key: "order_id",
        },
        {
            title: "Customer",
            dataIndex: "customer_name",
            key: "customer_name",
            render: (_: string, record: IOrder) => (record.customer.name)
        },
        {
            title: "Total Amount",
            dataIndex: "total_amount",
            key: "total_amount",
        },
        {
            title: "Amount Tendered",
            dataIndex: "amount_tendered",
            key: "amount_tendered",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text: string) => <Tag 
                                            icon={text === "pending" ? <SyncOutlined spin /> : (text === "approved") ? <CheckCircleOutlined /> : <CloseCircleOutlined /> }
                                            color={text === "pending" ? "processing" : (text === "approved") ? "success" : "error"}>
                                            {text}
                                      </Tag>
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_: string, order: IOrder) => {
                if (order.status === "pending") {
                    return <Space direction="horizontal">
                            <Button type="primary" shape="round" icon={<CheckCircleOutlined />} size={"middle"} onClick={() => onCheckout(order)}>
                                Checkout
                            </Button>
                            <Button shape="round" icon={<CloseOutlined />} size={"middle"} danger/>
                        </Space>
                }else{
                    return ""
                }
            }
        }
    ]

    
    return (
        <div>
            <Typography.Title level={2}>Orders</Typography.Title>
            <Table 
                columns={columns}
                dataSource={orders}
            />
        </div>
    );
};

export default Orders;
