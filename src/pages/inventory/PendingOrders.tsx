import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPendingOrders, approveInventoryOrder } from '../../services/InventoryAPI'
import { IInventoryOrder } from '../../interfaces/Inventory'
import { ServerResponse } from '../../interfaces/Server'
import { AppError } from '../../interfaces/Error'
import { useAuthHeader } from 'react-auth-kit'
import { Modal, Table, Tag, Button, Typography, Input, Space, message } from "antd";
import { useEffect } from 'react'
import { SyncOutlined } from '@ant-design/icons'

interface ITableInfo {
  product: string;
  quantity: number;
}

const { Search } = Input;

const PendingOrders = () => {
  const [ pendingOrders, setPendingOrders ] = useState<IInventoryOrder[]>([])
  const [ orderDetailsModal, setOrderDetailsModal ] = useState<boolean>(false)
  const [ selectedOrder, setSelectedOrder ] = useState<IInventoryOrder | null>(null)
  const [ tableInfo, setTableInfo ] = useState<ITableInfo[]>([])
  const [messageApi, contextHolder] = message.useMessage();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const authHeader = useAuthHeader();
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<ServerResponse<IInventoryOrder[]>, Error>(
    ['pending_orders'],
    () => getPendingOrders(authHeader())
  );
  
  const { mutate, isLoading: isSubmitting } = useMutation({
    mutationFn: (inventoryOrder: IInventoryOrder) => {
      setConfirmLoading(isSubmitting)

      return approveInventoryOrder(authHeader(), inventoryOrder)
    },
    onSuccess: (data) => {
        queryClient.invalidateQueries();
        success(data?.data || "")
        setConfirmLoading(false)
        setOrderDetailsModal(false);
    },
    onError: (error: AppError) => {
        messageApi.open({
            type: 'error',
            content: error.message + ". Please Check your internet connection and refresh the page."
        });
        setTimeout(messageApi.destroy, 2500);
    }
});

  const success = (msg:string) => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
    setTimeout(messageApi.destroy, 2500);
  }


  console.log(data);

  useEffect(() => {
    
    if (data?.data) {
      setPendingOrders(data.data)
    }

  },[data]);

  const handleSelectOrder = (inventoryOrder: IInventoryOrder) => {
    setSelectedOrder(inventoryOrder);
    setTableInfo(inventoryOrder.order.sales.map(item => ({product: item.product.sku_name, quantity: item.quantity})));
    setOrderDetailsModal(true);
  }

  const handleApprove = () => {
    console.log("APPROVING ORDER::", selectedOrder);

    mutate(selectedOrder as IInventoryOrder)

  }

  const onSearch = (searchTerm: string) => {
    console.log("SEARCHING::",searchTerm);
    setPendingOrders(data?.data?.filter(item => item.order.transaction_id.indexOf(searchTerm) !== -1) || []);
  }

  const columns = [
      {
        title: 'OrderID',
        dataIndex: 'order.transaction_id',
        key: 'order_id',
        render: (_: string, item: IInventoryOrder) => <Button type="link" onClick={() => handleSelectOrder(item)}>{ item.order.transaction_id }</Button>,
      },
      {
          title: 'Date',
          dataIndex: 'datetime',
          key: 'datetime',
      },
      {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
        render: (_: string, item: IInventoryOrder) => (
          <span>{ item.order.customer.name }</span>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Tag color={"processing"} icon={<SyncOutlined />}>{status}</Tag>
        )
      }
  ];

  const modalColumns = [
    {
      title: 'SKU Name',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    }
  ];

    return (
    <>
        {contextHolder}
        <Typography.Title level={2}> Pending Orders </Typography.Title>
        <Space>
          <Search
              placeholder="Search for OrderID"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
          />
        </Space>
        <Table 
            loading={isLoading}
            columns={columns}
            dataSource={pendingOrders}
        />
        <Modal
            title="Order Details"
            
            open={orderDetailsModal}
            style={{ top: 20 }}
            onOk={() => {}}
            confirmLoading={confirmLoading}
            onCancel={() => setOrderDetailsModal(false)}
            footer={
              <>
                <Button size={'large'} onClick={() => setOrderDetailsModal(false)} > Close </Button>
                <Button size={'large'} type={'primary'} onClick={handleApprove}> Approve! </Button>
              </>
            }
        >
         <Table 
          columns={modalColumns}
          dataSource={tableInfo}
          footer={(info) => <>
                  <Typography.Title level={5}>Total Quantity: {info.reduce((acc, item) => acc + item.quantity, 0)}</Typography.Title>
                </>}
         />
        </Modal>

    </>)

}

export default PendingOrders;