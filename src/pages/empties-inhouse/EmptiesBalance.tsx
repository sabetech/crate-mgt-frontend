import {  Row, Col, Statistic, Card, Typography, List } from 'antd';
import { useAuthHeader } from "react-auth-kit";
import { useQuery } from '@tanstack/react-query';
import { ServerResponse } from '../../interfaces/Server';
import { IEmptiesBalance } from '../../interfaces/Empties';
import { getEmptiesBalance } from '../../services/EmptiesAPI';

const EmptiesBalance = () => {

    const authHeader = useAuthHeader();

    const { data: emptiesBalance } = useQuery<ServerResponse<IEmptiesBalance[]>>({
        queryKey: ['empties-balance'],
        queryFn: () => getEmptiesBalance(authHeader()),
    });

    console.log("EMPTIES BALANCE::", emptiesBalance);

    return (
        <>
            <Typography.Title level={2}>Empties On Ground</Typography.Title>
            <Row gutter={16}>
                <Col span={12}>
                    <Card bordered={true}>
                        <Statistic
                            title="Total Empties On Ground"
                            value={emptiesBalance && emptiesBalance.data?.reduce((acc: number, item: IEmptiesBalance) => acc + item.quantity, 0)}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>
            </Row>

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
            
        </>
    )
}

export default EmptiesBalance;