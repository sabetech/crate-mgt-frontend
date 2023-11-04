import { Table } from "antd";

const PendingOrders = () => {

    const columns = [
        {
          title: 'OrderID',
          dataIndex: 'order_id',
          key: 'order_id',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
          title: 'Product',
          dataIndex: 'product',
          key: 'product',
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
            title: 'Current Balance',
            dataIndex: 'current_balance',
            key: 'current_balance',
        },
        {
          title: 'Final Balance',
          dataIndex: 'final_balance',
          key: 'final_balance',
      },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
      ];


    return (<>
        <h1>Pending Orders</h1>
        <Table 
            columns={columns}
        />

    </>)

}

export default PendingOrders;