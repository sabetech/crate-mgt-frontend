import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCustomersWithBalance } from '../services/CustomersAPI';
import { getInHouseEmpties } from '../services/EmptiesAPI';
import { useAuthHeader } from 'react-auth-kit';
import { ServerResponse } from '../interfaces/Server';
import { ICustomer } from '../interfaces/Customer';
import { useEffect } from 'react';
import { IEmptiesInHouseCount } from '../interfaces/Empties';


const Dashboard = () => {
    const navigate = useNavigate();
    const authHeader = useAuthHeader();
    const [currentEmptiesOnGround, setCurrentEmtpiesOnGround] = useState<IEmptiesInHouseCount>();
    
    const { data:customers} = useQuery<ServerResponse<ICustomer[]>, Error>(
        {
            queryKey: ['customer_with_balance'],
            queryFn: () => getCustomersWithBalance(authHeader(), {customer_type: 'all'})
        }
    );

    console.log("CUSTOMERS", customers?.data)

    const { data: totalEmpties } = useQuery(
        {
            queryKey: ['totalEmpties'],
            queryFn: () => getInHouseEmpties(authHeader())
        }
    )

    useEffect(() => {   
        
        if (totalEmpties) {
            let latestEmptiesCount = totalEmpties.data[totalEmpties.data.length - 1];
            setCurrentEmtpiesOnGround(latestEmptiesCount)
        }

    }, [totalEmpties]);

    const handleClick = (location: string) => {
        switch (location) {
            case 'customers':
                navigate('/customers');
            break;
            case 'emptiesOnGround':
                navigate('/empties/list-on-ground');
            break;
        }
    }

    return (
    <Row gutter={16}>
        <Col >
            <Card title="Total Empties" bordered={false} style={{cursor: 'pointer'}} onClick={() => handleClick('emptiesOnGround')}>
            <Statistic
                title={"Empties Ground as at " + currentEmptiesOnGround ? currentEmptiesOnGround?.date : "" }
                value={currentEmptiesOnGround?.quantity}
                precision={0}
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
        {/* <Col >
            <Card title="Empties with GBL" bordered={false} style={{cursor: 'pointer'}}>
                <Statistic
                    title="Active"
                    value={11.28}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    
                    />
            </Card>
        </Col> */}
        {/* <Col >
            <Card title="Opening Stock" bordered={false} style={{cursor: 'pointer'}}>
                <Statistic
                    title="Date: 12/12/2020"
                    value={11}
                    valueStyle={{ color: '#3f8600' }}
                    />
            </Card>
        </Col> */}
    </Row>
    );
}

export default Dashboard;