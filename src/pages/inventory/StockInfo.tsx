import { Space, Card, Typography, Statistic, Table, DatePicker } from "antd";

const StockInfo = () => {

    const columns = [
          {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
          },
          {
            title: 'Closing Stock',
            dataIndex: 'closing_stock',
            key: 'closing_stock',
          },
          {
            title: 'Breakages',
            dataIndex: 'breakages',
            key: 'key'
          }
    ];

    const onDateChange = () => {

    }

    return  (
    <>
        <h1>Stock Info</h1>
        <Space direction={"horizontal"}>
            <Typography.Text>Select Date</Typography.Text> <DatePicker onChange={onDateChange} />
        </Space>
        <Card title="Closing Stock as at {{ date }}" bordered={false}>
            <Statistic 
                value={1230}
                valueStyle={{ color: '#3f8600' }}
            />
        </Card>
        <Table 
            columns={columns}
        />
    </>)
}

export default StockInfo;