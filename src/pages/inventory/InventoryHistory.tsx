import { useState } from "react";
import { DatePicker, Typography, Space, Card, Statistic } from "antd";
import dayjs from 'dayjs';

const InventoryHistory = () => {
    const [inventoryHistory, setInventoryHistory] = useState([]);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))



    return (<>
        <Space>
            <Typography.Title level={3}>Inventory History</Typography.Title>
            <DatePicker 
                value={dayjs(date)}
                onChange={(date) => {date && setDate(date.format('YYYY-MM-DD'))}}
            />
        </Space>
        <Space direction={"horizontal"} style={{marginTop: '2%'}}>
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
    </>)
}

export default InventoryHistory;