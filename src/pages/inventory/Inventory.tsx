import { Card, Statistic, Table, DatePicker, Space, Typography } from "antd";

const Inventory = () => {

    const columns = [
        {
          title: 'Product',
          dataIndex: 'product',
          key: 'product',
        },
        {
          title: 'Opening Stock',
          dataIndex: 'opening_stock',
          key: 'opening_stock',
        },
        {
            title: 'Pending Orders (office)',
            dataIndex: 'pending_orders',
            key: 'pending_orders',
        },
        {
          title: 'Orders (Office)',
          dataIndex: 'orders',
          key: 'orders',
        },
        {
            title: 'Received from GGBL',
            dataIndex: 'received',
            key: 'received',
        },
        {
            title: 'Loadouts',
            dataIndex: 'loadouts',
            key: 'loadouts',
        },
        {
            title: 'Returns by VSEs',
            dataIndex: 'returns',
            key: 'returns',
        },
        {
            title: 'Breakages',
            dataIndex: 'breakages',
            key: 'breakages',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
        },
      ];

    function onChange(date: any, dateString: any) {
        console.log(date, dateString);
    }

    return (
        <>
            <h1>Stock Balances</h1>
            <Space direction={"horizontal"}>
                <Typography.Text>Select Date</Typography.Text> <DatePicker onChange={onChange} />
            </Space>
            <Card title="Opening Stock as at {{ date }}" bordered={false}>
                <Statistic 
                    value={1230}
                    valueStyle={{ color: '#3f8600' }}
                />
            </Card>

            <Table 
                columns={columns}
            />
        </>
    )
}

export default Inventory;