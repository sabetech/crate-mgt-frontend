import { Typography, DatePicker, Space, Skeleton, Statistic, Card } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import React, {useState} from 'react';
import { ILoadout } from '../../interfaces/Inventory'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLoadouts } from '../../services/InventoryAPI';
import { useAuthHeader } from 'react-auth-kit';
import dayjs from 'dayjs';

const LoadoutList: React.FC = () => {
    const authHeader = useAuthHeader();
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery(
        {
            queryKey: ['loadouts'],
            queryFn: () => getLoadouts(authHeader()),
            onError: (error: Error) => {
                console.log(error);
            }
        }
    );

    const onDateChange = (_: any, dateStr: string) => {
        setDate(dateStr)
        // refetch();
        // queryClient.invalidateQueries(['stock_info']);
        queryClient.invalidateQueries();
    }

    const [loadouts, setLoadouts] = React.useState<ILoadout[] | undefined>([]);


    return (
        <div>
            <Typography.Title level={2}>Loadouts</Typography.Title>
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
        </div>
    );
};

export default LoadoutList;
