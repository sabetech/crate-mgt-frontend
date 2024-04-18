import { useState } from "react";
import { Row, Col, DatePicker, Typography, Space, Card, Statistic } from "antd";
import dayjs from 'dayjs';

const InventoryHistory = () => {
    const [inventoryHistory, setInventoryHistory] = useState([]);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))



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
    </>)
}

export default InventoryHistory;