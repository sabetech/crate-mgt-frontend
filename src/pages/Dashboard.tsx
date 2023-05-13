import { Card, Col, Row } from 'antd';

const Dashboard = () => {
    return (
    <Row gutter={16}>
        <Col span={8}>
            <Card title="Total Empties" bordered={false}>
                Card content
            </Card>
        </Col>
        <Col span={8}>
            <Card title="Customers" bordered={false}>
                Card content
            </Card>
        </Col>
        <Col span={8}>
            <Card title="Empties with GBL" bordered={false}>
                Card content
            </Card>
        </Col>
    </Row>
    );
}

export default Dashboard;