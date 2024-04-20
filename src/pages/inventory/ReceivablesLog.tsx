import { useState } from "react";
import { Card, Row, Col, DatePicker, Statistic, Space, Image } from "antd";
import dayjs from 'dayjs'
import TableReceivableLog from "../../components/TableReceivableLog";
import type { ColumnsType } from 'antd/es/table';
import { IInventoryReceivable } from "../../interfaces/Inventory";
import { useQuery } from "@tanstack/react-query";
import { ServerResponse } from "../../interfaces/Server";
import { getReceivableLogs } from "../../services/InventoryAPI";
import { useAuthHeader } from "react-auth-kit";
import { IProduct } from "../../interfaces/Product";

const ReceivablesLog = () => {

    const [date, setDate] = useState(dayjs())
    const authHeader = useAuthHeader();

    const columns: ColumnsType<IInventoryReceivable> = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        {title: 'Purchase Order', dataIndex: 'purchase_order_number', key: 'purchase_order_number'},
        { title: 'Product', dataIndex: 'product', key: 'date', 
            render: (product: IProduct) => product.sku_name
         },
         {title: 'Amount Received', dataIndex: 'quantity', key: 'quantity'},
         {title: 'Way Bill Image', dataIndex: 'way_bill_image_url', key: 'way_bill_image_url',
            render: (val: string) => <Image src={`http://localhost:8000${val}`} width={50} />
         }
         
    ]
    
    const handleDateSelect = (_: any, dateString: string) => {
        setDate(dayjs(dateString))
    }

    const {data: receiveableLogs} = useQuery<ServerResponse<IInventoryReceivable[]>>({
        queryKey: ['inventory_receivable', date],
        queryFn: () => getReceivableLogs(date.format("YYYY-MM-DD"), authHeader())
    })

    return (
        <>
            <h1>
                Receivables Log
            </h1>
            <DatePicker 
                size={'large'}
                onChange={handleDateSelect}
                value={date}
            />
            <Row gutter={16} style={{marginTop: '2%'}}>
                <Col span={6}>
                    <Card bordered={true}>
                        <Statistic 
                            title={"Products Received"}
                            value={receiveableLogs?.data.reduce( (acc, itm) => itm.quantity + acc, 0 )}
                        />
                    </Card>
                </Col>
            </Row>
            <Space>
                <TableReceivableLog data={receiveableLogs} columns={columns}/>
            </Space>
        </>
    );
}

export default ReceivablesLog;