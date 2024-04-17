import { Card, Row, Col, DatePicker, Statistic, Space } from "antd";
import dayjs from 'dayjs'
import TableReceivableLog from "../../components/TableReceivableLog";
import type { ColumnsType } from 'antd/es/table';
import { IInventoryReceivable } from "../../interfaces/Inventory";

const ReceivablesLog = () => {

    const columns: ColumnsType<IInventoryReceivable> = []

    return (
        <>
            <h1>
                Receivables Log
            </h1>
            <DatePicker 
                size={'large'}
                value={dayjs()}
            />
            <Row gutter={16} style={{marginTop: '2%'}}>
                <Col span={6}>
                    <Card bordered={true}>
                        <Statistic 
                            title={"Products Received"}
                            value={0}
                        />
                    </Card>
                </Col>
            </Row>
            <Space>
                <TableReceivableLog />
            </Space>
        </>
    );
}

export default ReceivablesLog;