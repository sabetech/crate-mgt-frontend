import { Card, Row, Col, DatePicker, Statistic, Space } from "antd";

const ReceivablesLog = () => {
    return (
        <>
            <h1>
                Receivables Log
            </h1>
            <DatePicker 
                size={'large'}
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
                
            </Space>
        </>
    );
}

export default ReceivablesLog;