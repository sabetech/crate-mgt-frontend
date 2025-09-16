import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Space, Card, Typography, Statistic, Table, DatePicker, Skeleton } from "antd";
import { getStock } from "../../services/InventoryAPI";
import dayjs from 'dayjs';
import { useAuthToken } from "../../hooks/auth";
import { IStockReport } from "../../interfaces/Product";
import { CreditCardOutlined } from "@ant-design/icons";


const StockInfo = () => {

    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [tableData, setTableData] = useState([]);
    const authToken = useAuthToken();
    const queryClient = useQueryClient()

    const { data: stockInfo, isLoading } = useQuery(
        {
            queryKey: ['stock_info', date],
            queryFn: () => getStock(authToken, date)
        },

    );

    useEffect(() => {

        if (stockInfo) {
            setTableData(stockInfo.data.map((stockItem: IStockReport) => 
                ({
                    key: stockItem.id,
                    product: stockItem.product.sku_name,
                    closing_stock: stockItem.quantity,
                    breakages: stockItem.breakages
                })
            ))
        }

    },[stockInfo]);

    const columns = [
          {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
          },
          {
            title: 'Current Balance',
            dataIndex: 'current_balance',
            key: 'current_balance',
          },
          {
            title: 'Closing Stock',
            dataIndex: 'closing_stock',
            key: 'closing_stock',
          },
          {
            title: 'Breakages',
            dataIndex: 'breakages',
            key: 'breakages'
          }
    ];

    const onDateChange = (_: any, dateStr: string) => {
        setDate(dateStr)
        // refetch();
        // queryClient.invalidateQueries(['stock_info']);
        queryClient.invalidateQueries();
    }

    return  (
    <>
        <Typography.Title level={2}>Stock Info</Typography.Title>
       
        
            <Space direction={"vertical"}>
                <Space direction={"horizontal"}>
                    <Typography.Text>Select Date</Typography.Text> <DatePicker defaultValue={dayjs(date)} onChange={onDateChange} />
                </Space>
                <Space direction={"horizontal"}>
                {
                    isLoading &&
                                <>
                                    <Skeleton.Node active={true} style={{width: 300, height: 140}}>
                                        <CreditCardOutlined style={{ fontSize: 60, color: '#bfbfbf' }} />
                                    </Skeleton.Node>
                                    <Skeleton.Node active={true} style={{width: 300, height: 140}}>
                                        <CreditCardOutlined style={{ fontSize: 60, color: '#bfbfbf' }} />
                                    </Skeleton.Node>
                                </>  ||
                                <>
                        <Card title={`Closing Stock as at ${dayjs(date, { format: 'YYYY-MM-DD' }).format('D MMM YYYY')}`} >
                            <Statistic 
                                value={ stockInfo && stockInfo.data.reduce((acc: number, item: IStockReport) => acc + item.quantity, 0) || 0 }
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                        <Card title={`Closing Breakages as at ${dayjs(date, { format: 'YYYY-MM-DD' }).format('D MMM YYYY')}`} >
                            <Statistic 
                                value={ stockInfo && stockInfo.data.reduce((acc: number, item: IStockReport) => acc + item.breakages, 0) || 0 }
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                        </>
                }
                </Space>
            </Space>
            <Table 
                style={{ marginTop: 20 }}
                columns={columns}
                dataSource={tableData}
                loading={isLoading}
            />
    </>
    );
}

export default StockInfo;