import { Card, Statistic, Table } from "antd";

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
          title: 'Orders',
          dataIndex: 'orders',
          key: 'orders',
        },
        {
            title: 'Pending Orders',
            dataIndex: 'pending_orders',
            key: 'pending_orders',
        },
        {
            title: 'Received',
            dataIndex: 'received',
            key: 'received',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
        },
      ];

    return (
        <>
            <h1>Current Stock Balances</h1>
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