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
    const [inventoryHistorySummary, setInventoryHistorySummary] = useState();

    const { data: inventoryLogs } = useQuery({
        queryKey: ['inventoryLogs', date],
        queryFn: () => getInventoryTransactions(date, authHeader())
    });

    useEffect(() => {

        if(inventoryLogs?.success) {
            setInventoryHistory(inventoryLogs.data);
        }

    },[inventoryLogs]);

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