import { useEffect, useState } from "react";
import { Row, Col, DatePicker, Typography, Space, Card, Statistic } from "antd";
import dayjs from 'dayjs';
import { useQuery } from "@tanstack/react-query";
import { getInventoryTransactions } from "../../services/InventoryAPI";

import { useAuthToken } from "../../hooks/auth";
import { IInventoryTransaction } from "../../interfaces/Inventory";
import TableInventoryTransaction from "../../components/TableInventoryTransactions";

const InventoryHistory = () => {
    const authToken = useAuthToken();
    const [inventoryHistory, setInventoryHistory] = useState<IInventoryTransaction[]>([]);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [historyMap, setHistoryMap] = useState<Map<number, any>>(new Map());
    // const [inventoryHistorySummary, setInventoryHistorySummary] = useState([]);

    const { data: inventoryLogs } = useQuery({
        queryKey: ['inventoryLogs', date],
        queryFn: () => getInventoryTransactions(date, authToken ?? "invalid-token")
    });

    useEffect(() => {

        if(inventoryLogs?.success) {
            setInventoryHistory(inventoryLogs.data);
        }

    },[inventoryLogs]);

    console.log("inventory logs", inventoryHistory)

    useEffect(() => {

        if (inventoryHistory) {
            const productHistoryMap = new Map();

            for(let i = 0; i < inventoryHistory.length; i++) {
                let item = inventoryHistory[i];

                if (typeof productHistoryMap.get(item.product.id) === 'undefined') {

                    console.log("Fresh ITEM::", item)
                    switch(item.activity) {
                        case 'purchase_order':
                            productHistoryMap.set(item.product.id, {
                                product: item.product,
                                opening_stock: 0,
                                quantity_received: item.quantity,
                                vse_loadout: 0,
                                quantity_sold: 0,
                                vse_returns: 0,
                                promo_stock: 0,
                                promo_stock_reimbursement: 0,
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
                                promo_stock: 0,
                                promo_stock_reimbursement: 0,
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
                                promo_stock: 0,
                                promo_stock_reimbursement: 0,
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
                                promo_stock: 0,
                                promo_stock_reimbursement: 0,
                                breakages: 0,
                                other: 0,
                                closing_stock: 0
                            });
                        break;

                        case 'promo_stock_disbursement':
                            productHistoryMap.set(item.product.id, {
                                product: item.product,
                                quantity_received: 0,
                                vse_loadout: 0,
                                quantity_sold: 0,
                                vse_returns: 0,
                                promo_stock: item.quantity,
                                promo_stock_reimbursement: 0,
                                breakages: 0,
                                other: 0,
                                closing_stock: 0
                            });
                        break;

                        case 'promo_stock_reimbursement':
                            productHistoryMap.set(item.product.id, {
                                product: item.product,
                                quantity_received: 0,
                                vse_loadout: 0,
                                quantity_sold: 0,
                                vse_returns: 0,
                                promo_stock: 0,
                                promo_stock_reimbursement: item.quantity,
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
                            productHistoryMap.set(item.product.id, {...productObject, 
                                quantity_received: item.quantity + productObject.quantity_received,});
                        break;

                        case 'sale_request':
                            productHistoryMap.set(item.product.id, {
                               ...productHistoryMap,
                                quantity_sold: item.quantity + productObject.quantity_sold,
                            });
                        break;

                        case 'load_out':
                            productHistoryMap.set(item.product.id, {
                                ...productHistoryMap,
                                vse_loadout: item.quantity + productObject.vse_loadout,
                            });
                        break;

                        case 'loadout_return_in':
                            productHistoryMap.set(item.product.id, {
                                ...productHistoryMap,
                                vse_returns: item.quantity + productObject.vse_returns,
                            });
                        break;

                        case 'promo_stock_disbursement':
                            productHistoryMap.set(item.product.id, {
                                ...productHistoryMap,
                                promo_stock: item.quantity + productObject.promo_stock,
                            });
                        break;

                        case 'promo_stock_reimbursement':
                            productHistoryMap.set(item.product.id, {
                                ...productHistoryMap,
                                promo_stock_reimbursement: item.quantity + productObject.promo_stock_reimbursement,
                            });
                        break;

                        case 'other':
                            productHistoryMap.set(item.product.id, {
                                ...productHistoryMap,
                                other: item.quantity + productObject.other,
                            });
                        break;
                    } 
                }
            }
            setHistoryMap(productHistoryMap);
            console.log("PRODUCT HISTORY::", productHistoryMap)
        }
    }, [inventoryHistory]);

    console.log("inventory logs", inventoryHistory)
    const columns = [
        { title: 'Product', dataIndex: 'product', key: 'product' },
        { title: 'Opening Stock', dataIndex: 'opening_stock', key: 'opening_stock' },
        { title: 'Quantity Received', dataIndex: 'quantity_received', key: 'quantity_received' },
        { title: 'VSE Loadout', dataIndex: 'loadout', key: 'loadout' },
        { title: 'Quantity Sold', dataIndex: 'sold', key: 'sold' },
        { title: 'VSE Returns', dataIndex: 'vse_returns', key: 'vse_returns' },
        { title: 'Breakages', dataIndex: 'breakages', key: 'breakages'},
        { title: 'Promo Stock', dataIndex: 'promo_stock', key: 'promo_stock' },
        { title: 'Promo Stock Reimbursement', dataIndex: 'promo_stock_reimbursement', key: 'promo_stock' },
        { title: 'Other', dataIndex: 'other', key: 'other' },
        { title: 'Closing Stock', dataIndex: 'closing_stock', key: 'closing_stock' },
    ]

    console.log("History Map::", Array.from(historyMap.values()));

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
            <TableInventoryTransaction columns={columns} data={
                historyMap.size > 0 ? Array.from(historyMap.values()).map((item, index) => {
                    console.log("ITEM for table::", item)
                    return {
                        key: index,
                        product: item.product.sku_name,
                        opening_stock: item.quantity,
                        quantity_received: item.quantity_received,
                        loadout: item.vse_loadout,
                        sold: item.quantity_sold,
                        vse_returns: item.vse_returns,
                        breakages: item.breakages,
                        promo_stock: item.promo_stock,
                        promo_stock_reimbursement: item.promo_stock_reimbursement,
                        other: item.other,
                        closing_stock: item.closing_stock
                    }
                }) : []
            } />
        </Space>
    </>)
}

export default InventoryHistory;