import { useEffect, useState } from "react";
import { Row, Col, DatePicker, Typography, Space, Card, Statistic } from "antd";
import dayjs from 'dayjs';
import { useQuery } from "@tanstack/react-query";
import { getInventoryTransactions } from "../../services/InventoryAPI";
import { useAuthHeader } from "react-auth-kit";
import { IInventoryTransaction } from "../../interfaces/Inventory";
import TableInventoryTransaction from "../../components/TableInventoryTransactions";
import type { ColumnsType } from 'antd/es/table';

const InventoryHistory = () => {
    const authHeader = useAuthHeader();
    const [inventoryHistory, setInventoryHistory] = useState<IInventoryTransaction[]>([]);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [inventoryHistorySummary, setInventoryHistorySummary] = useState([]);

    const { data: inventoryLogs } = useQuery({
        queryKey: ['inventoryLogs', date],
        queryFn: () => getInventoryTransactions(date, authHeader())
    });

    useEffect(() => {

        if(inventoryLogs?.success) {
            setInventoryHistory(inventoryLogs.data);
        }

    },[inventoryLogs]);

    useEffect(() => {

        if (inventoryHistory) {
            const productHistoryMap = new Map();

            for(let i = 0; i < inventoryHistory.length; i++) {
                let item = inventoryHistory[i];

                if (typeof productHistoryMap.get(item.product.id) === 'undefined') {

                    switch(item.activity) {
                        case 'purchase_order':
                            productHistoryMap.set(item.product.id, {
                                product: item.product,
                                quantity_received: item.quantity,
                                vse_loadout: 0,
                                quantity_sold: 0,
                                vse_returns: 0,
                                breakages: 0,
                                other: 0,
                                closing_stock: 0
                            });
                        break;

                        case 'sale_request':
                            productHistoryMap.set(item.product.id, {
                                product: item.product,
                                quantity_received: 0,
                                vse_loadout: 0,
                                quantity_sold: item.quantity,
                                vse_returns: 0,
                                breakages: 0,
                                other: 0,
                                closing_stock: 0
                            });
                        break;

                        case 'load_out':
                            productHistoryMap.set(item.product.id, {
                                product: item.product,
                                quantity_received: 0,
                                vse_loadout: item.quantity,
                                quantity_sold: 0,
                                vse_returns: 0,
                                breakages: 0,
                                other: 0,
                                closing_stock: 0
                            });
                        break;

                        case 'return_in':
                            productHistoryMap.set(item.product.id, {
                                product: item.product,
                                quantity_received: 0,
                                vse_loadout: 0,
                                quantity_sold: 0,
                                vse_returns: item.quantity,
                                breakages: 0,
                                other: 0,
                                closing_stock: 0
                            });
                        break;

                        case 'other':
                            productHistoryMap.set(item.product.id, {
                                product: item.product,
                                quantity_received: 0,
                                vse_loadout: 0,
                                quantity_sold: 0,
                                vse_returns: 0,
                                breakages: 0,
                                other: item.quantity,
                                closing_stock: 0
                            });
                        break;
                    } 
                }else {
                    const productObject = productHistoryMap.get(item.product.id);
                    switch(item.activity) {
                        case 'purchase_order':
                            productHistoryMap.set(item.product.id, {...productObject, quantity_received: item.quantity});
                        break;

                        case 'sale_request':
                            productHistoryMap.set(item.product.id, {
                               ...productHistoryMap,
                                quantity_sold: item.quantity,
                            });
                        break;

                        case 'load_out':
                            productHistoryMap.set(item.product.id, {
                                ...productHistoryMap,
                                vse_loadout: item.quantity,
                            });
                        break;

                        case 'return_in':
                            productHistoryMap.set(item.product.id, {
                                ...productHistoryMap,
                                vse_returns: item.quantity,
                            });
                        break;

                        case 'other':
                            productHistoryMap.set(item.product.id, {
                                ...productHistoryMap,
                                other: item.quantity,
                            });
                        break;
                    } 
                }
            }
            console.log("PRODUCT HISTORY::", productHistoryMap)
        }
    }, [inventoryHistory]);

    console.log("inventory logs", inventoryHistory)
    const columns = [
        { title: 'Opening Stock', dataIndex: '', key: 'opening_stock' },
        { title: 'Quantity Received', dataIndex: '', key: 'quantity_received' },
        { title: 'VSE Loadout', dataIndex: '', key: 'loadout' },
        { title: 'Quantity Sold', dataIndex: '', key: 'sold' },
        { title: 'VSE Returns', dataIndex: '', key: 'vse_returns' },
        { title: 'Breakages', dataIndex: '', key: 'breakages'},
        { title: 'Other', dataIndex: '', key: 'other' },
        { title: 'Closing Stock', dataIndex: '', key: 'closing_stock' },
    ]

    const makeSummary = () => {
        let summary = [];
        
        
        

    }

    return (<>
        <Row>
            <Col span={16}>
                <Space direction={"vertical"}>
                    <Typography.Title level={3}>Inventory History</Typography.Title>
                    <DatePicker 
                        value={dayjs(date)}
                        onChange={(date) => {date && setDate(date.format('YYYY-MM-DD'))}}
                    />
                </Space>
            </Col>
        </Row>
        <Space direction={"horizontal"} style={{marginTop: '5%'}}>
            <Card>
                <Statistic 
                    title={"Total Opening balance"}
                    value={0}
                />
            </Card>
            <Card>
                <Statistic 
                    title={"Total Closing Balance"}
                    value={0}
                />
            </Card>
        </Space>
        <Space>
            <TableInventoryTransaction columns={columns} data={[]} />
        </Space>
    </>)
}

export default InventoryHistory;