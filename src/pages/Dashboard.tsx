import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCustomersWithBalance } from '../services/CustomersAPI';
import { useAuthHeader } from 'react-auth-kit';
import { ServerResponse } from '../interfaces/Server';
import { ICustomer } from '../interfaces/Customer';


const Dashboard = () => {
    const navigate = useNavigate();
    const authHeader = useAuthHeader();
    
    const { data:customers} = useQuery<ServerResponse<ICustomer[]>, Error>(
        {
            queryKey: ['customer_with_balance'],
            queryFn: () => getCustomersWithBalance(authHeader())
        }
    );

    // const { data: totalEmpties } = useQuery(
    //     {
    //         queryKey: ['totalEmpties'],
    //         // queryFn: () => getTotalEmptiesCount(authHeader())
    //     }
    // )

    const handleClick = (location: string) => {
        switch (location) {
            case 'customers':
                navigate('/customers');
            break;
        }
    }

    return (
    <Row gutter={16}>
        <Col >
            <Card title="Total Empties" bordered={false} style={{cursor: 'pointer'}}>
            <Statistic
                title="Empties Ground as at"
                value={11.28}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                
                />
            </Card>
        </Col>
        <Col >
            <Card title="Customers" bordered={false} style={{cursor: 'pointer'}} onClick={() => handleClick('customers')}>
            <Statistic
                title="All Customers"
                value={customers?.data?.length || 0}
                valueStyle={{ color: '#3f8600' }}
                />
            </Card>
        </Col>
        <Col >
            <Card title="Empties with GBL" bordered={false} style={{cursor: 'pointer'}}>
                <Statistic
                    title="Active"
                    value={11.28}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    
                    />
            </Card>
        </Col>
    </Row>
    );
}

export default Dashboard;