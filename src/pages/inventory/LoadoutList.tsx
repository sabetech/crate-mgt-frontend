import { Typography, DatePicker, Space, Skeleton, Statistic, Card, Table } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLoadoutByVSE } from '../../services/InventoryAPI';
import { useAuthToken } from '../../hooks/auth';
import dayjs from 'dayjs';
import { ILoadoutInfo } from '../../interfaces/Inventory';
// import { IVSECustomer } from '../../interfaces/Customer';

const LoadoutList: React.FC = () => {
    const authToken = useAuthToken();
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const queryClient = useQueryClient();

    const { data:vseCustomers, isLoading } = useQuery(
        {
            queryKey: ['loadouts', date],
            queryFn: () => getLoadoutByVSE(authToken, date),
            onError: (error: Error) => {
                console.log(error);
            }
        }
    );

    useEffect(() => {

        if (vseCustomers) {
            console.log(vseCustomers.data);
            // let vseData = 


            // setVseLoadoutData(loadouts.map((loadout: any) => 
            //     ({
            //         key: loadout.id,
            //         vse: loadout.vse.name,
            //         quantity: loadout.quantity,
            //         quantity_sold: loadout.quantity_sold,
            //         quantity_returned: loadout.quantity_returned,
            //         outstanding_balance: loadout.outstanding_balance
            //     })
            // ))
        }

    },[vseCustomers]);

    const onDateChange = (_: any, dateStr: string) => {
        setDate(dateStr)
        queryClient.invalidateQueries();
    }

    // console.log(loadouts);
    const columns = [
        {
            title: 'VSE',
            dataIndex: 'vse',
            key: 'vse',
        },
        {
            title: 'Quantity Given',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Quantity Sold',
            dataIndex: 'quantity_sold',
            key: 'quantity_sold'
        },
        {
            title: 'Quantity Returned',
            dataIndex: 'returned',
            key: 'returned'
        },
        {
            title: 'Outstanding Balance',
            dataIndex: 'vse_outstandingbalance',
            key: 'vse_outstandingbalance'
        }
    ];


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
                                value={  0 }
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                        <Card title={`Closing Breakages as at ${dayjs(date, { format: 'YYYY-MM-DD' }).format('D MMM YYYY')}`} >
                            <Statistic 
                                value={  0 }
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                        </>
                }
                </Space>

                <Table 
                    style={{ marginTop: 20 }}
                    columns={columns}
                    dataSource={vseCustomers?.data.map(vseCustomer => {
                        return {
                        key: vseCustomer.id,
                        vse: vseCustomer.name,
                        quantity: vseCustomer.vse_loadout.reduce((acc: number, item: ILoadoutInfo) => acc + item.quantity, 0),
                        quantity_sold: vseCustomer.vse_loadout.reduce((acc: number, item: ILoadoutInfo) => acc + (item.quantity_sold ?? 0) , 0),
                        quantity_returned: vseCustomer.vse_loadout.reduce((acc: number, item: ILoadoutInfo) => acc + (item.returned ?? 0) , 0),
                        outstanding_balance: vseCustomer.vse_loadout.reduce((acc: number, item: ILoadoutInfo) => acc + (item.vse_outstandingbalance ?? 0) , 0),
                        }
                    }
                )}
                    loading={isLoading}
                    pagination={false}
                />

            </Space>
        </div>
    );
};

export default LoadoutList;
