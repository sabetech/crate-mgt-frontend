import {  Row, Col, Statistic, Card, Typography, List } from 'antd';
import { useAuthHeader } from "react-auth-kit";
import { useQuery } from '@tanstack/react-query';
import { ServerResponse } from '../../interfaces/Server';
import { IEmptiesBalance, IEmptiesTransaction } from '../../interfaces/Empties';
import { getEmptiesBalance, getEmptiesTransaction } from '../../services/EmptiesAPI';

const EmptiesOverview = () => {

    const authHeader = useAuthHeader();

    const { data: emptiesBalance } = useQuery<ServerResponse<IEmptiesBalance[]>>({
        queryKey: ['empties-balance'],
        queryFn: () => getEmptiesBalance(authHeader()),
    });

    const { data: emptiesTransactions } = useQuery<ServerResponse<IEmptiesTransaction[]>>({
        queryKey: ['empties-transaction'],
        queryFn: () => getEmptiesTransaction(authHeader()),
    });

    console.log("EMPTIES Transaction::", emptiesTransactions);

    return (
        <>
            <Typography.Title level={2}>Empties Overview</Typography.Title>
            <Row gutter={16}>
                <Col span={6}>
                    <Card bordered={true}>
                        <Statistic
                            title="Total Empties On Ground"
                            value={emptiesBalance && emptiesBalance.data?.reduce((acc: number, item: IEmptiesBalance) => acc + item.quantity, 0)}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={true}>
                        <Statistic
                            title="Empties in Trade"
                            value={emptiesBalance && emptiesBalance.data?.reduce((acc: number, item: IEmptiesBalance) => acc + item.quantity, 0)}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card bordered={true}>
                        <Statistic
                            title="Empties Owned By OPK"
                            value={emptiesBalance && emptiesBalance.data?.reduce((acc: number, item: IEmptiesBalance) => acc + item.quantity, 0)}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{marginTop: '30px'}}>
                <Col span={12}>
                    <List
                        header={<Typography.Title level={4}>Empties Balances</Typography.Title>}
                        bordered
                        dataSource={emptiesBalance?.data}
                        renderItem={(item: IEmptiesBalance) => (
                            <List.Item>
                            <Typography.Text>{item.product.sku_name} : </Typography.Text> 
                            <Typography.Text>{item.quantity}</Typography.Text>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>

            <Row gutter={16} style={{marginTop: '30px'}}>
                <Col span={12}>
                    <List
                        header={<Typography.Title level={4}>Empties Transaction History</Typography.Title>}
                        bordered
                        dataSource={emptiesBalance?.data}
                        renderItem={(item: IEmptiesBalance) => (
                            <List.Item>
                            <Typography.Text>{item.product.sku_name} : </Typography.Text> 
                            <Typography.Text>{item.quantity}</Typography.Text>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
            
        </>
    )
}

export default EmptiesOverview;