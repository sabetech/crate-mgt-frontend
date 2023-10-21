import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Space, Card, Typography, Statistic, Table, DatePicker } from "antd";
import { getStock } from "../../services/ProductsAPI";
import dayjs from 'dayjs';
import { useAuthHeader } from "react-auth-kit";
import { IStockReport } from "../../interfaces/Product";


const StockInfo = () => {

    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [tableData, setTableData] = useState([]);
    const authHeader = useAuthHeader();
    const queryClient = useQueryClient()

    const { data: stockInfo } = useQuery(
        {
            queryKey: ['stock_info'],
            queryFn: () => getStock(authHeader(), date)
        }
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
        queryClient.invalidateQueries(['stock_info']);
    }

    return  (
    <>
        <h1>Stock Info</h1>
        <Space direction={"vertical"}>
            <Space direction={"horizontal"}>
                <Typography.Text>Select Date</Typography.Text> <DatePicker defaultValue={dayjs(date)} onChange={onDateChange} />
            </Space>
            <Space direction={"horizontal"}>
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
            </Space>
        </Space>
        <Table 
            columns={columns}
            dataSource={tableData}
        />
    </>)
}

export default StockInfo;