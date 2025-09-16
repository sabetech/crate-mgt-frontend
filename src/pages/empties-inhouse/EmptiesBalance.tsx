import {  Row, Col, Statistic, Card, Typography, List, Tag } from 'antd';
import { useAuthToken } from "../../hooks/auth";
import { useQuery } from '@tanstack/react-query';
import { ServerResponse } from '../../interfaces/Server';
import { IEmptiesBalance, IEmptiesTransaction } from '../../interfaces/Empties';
import { getEmptiesBalance, getEmptiesTransaction } from '../../services/EmptiesAPI';
import dayjs from 'dayjs';
import { getProductsWithStockBalance } from '../../services/ProductsAPI';
// import { ICustomerReturnEmpties } from '../../interfaces/Customer';
import { getEmptiesInTrade } from '../../services/EmptiesAPI'
import { IProductWithBalance } from '../../interfaces/Product';


const EmptiesOverview = () => {

    const authToken = useAuthToken();

    const { data: emptiesBalance } = useQuery<ServerResponse<IEmptiesBalance[]>>({
        queryKey: ['empties-balance'],
        queryFn: () => getEmptiesBalance(authToken),
    });

    const { data: products } = useQuery({
        queryKey: ['products_balances'],
        queryFn: () => getProductsWithStockBalance(authToken)
    });

    console.log("Yayba::", products);

    const {data: emptiesInTrade } = useQuery<ServerResponse<number>>({
        queryKey: ['empties-in-trade'],
        queryFn: () => getEmptiesInTrade(authToken),
    });

    const { data: emptiesTransactions } = useQuery<ServerResponse<IEmptiesTransaction[]>>({
        queryKey: ['empties-transaction'],
        queryFn: () => getEmptiesTransaction(authToken),
    });

    console.log("EMPTIES In trade::", emptiesInTrade);

    return (
        <>
            <Typography.Title level={2}>Empties Overview</Typography.Title>
            <Row gutter={16}>
                <Col span={6}>
                    <Card bordered={true}>
                        <Statistic
                            title="Total Empties"
                            value={emptiesBalance && emptiesBalance.data?.reduce((acc: number, item: IEmptiesBalance) => acc + item.quantity, 0)}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card bordered={true}>
                        <Statistic
                            title="Number of Fulls"
                            value={
                                products && 
                                products
                                ?.filter((product: IProductWithBalance) => product.empty_returnable === true)
                                ?.reduce((acc: number, item: IProductWithBalance) => acc + item.inventory_balance.quantity, 0)}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="Amount of Fulls"
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card bordered={true}>
                        <Statistic
                            title="Empties in Trade"
                            value={emptiesInTrade != null ? emptiesInTrade.data : 0}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card bordered={true}>
                        <Statistic
                            title="Empties Owned By OPK"
                            value={0}
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
                        dataSource={emptiesTransactions?.data}
                        renderItem={(item: IEmptiesTransaction) => (
                            <List.Item>
                                <Typography.Text>{dayjs(item.datetime).format('D MMM, YYYY H:m A')} </Typography.Text> 
                                <Typography.Text>
                                    {item.product.sku_name} <Tag color={item.transaction_type == 'in' ? 'green': 'red'}> { item.transaction_type.toUpperCase() } </Tag> 
                                    <Tag color="default">{item.activity}</Tag> 
                                    </Typography.Text> 
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