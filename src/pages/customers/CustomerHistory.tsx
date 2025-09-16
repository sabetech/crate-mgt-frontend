import { Timeline, TimelineItemProps, Col, Row, Statistic, Button, Modal, Form, Skeleton } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useQuery } from "@tanstack/react-query";
import { useAuthToken } from '../../hooks/auth';
import { getCustomerHistory } from '../../services/CustomersAPI';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IHistoryItem } from '../../interfaces/Customer';
import { formatDate } from '../../utils/helpers';
import { useAuthUser } from '../../hooks/auth';

const CustomerHistory = () => {
    const authToken = useAuthToken();
    const user = useAuthUser();
    const loggedInUser = user();
    const [customerItems, setCustomerHistory] = useState({}) as any
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
    const { id } = useParams();
    
    const customerID  = id ? parseInt(id) : 0;

    const { data: customerHistory, isLoading } = useQuery(
        {
            queryKey: ['customer_history', customerID],
            queryFn: () => getCustomerHistory(customerID, authToken)
        }
    );

    console.log("loading::",isLoading);

    useEffect(() => {

        if (customerHistory) {
            let historyObjectArray = {} as any;
            for( let i = 0; i < customerHistory.data.length; i++) {
                if (historyObjectArray[customerHistory.data[i].date]) {
                    historyObjectArray[customerHistory.data[i].date] = [...historyObjectArray[customerHistory.data[i].date], customerHistory.data[i]]
                }else {
                    historyObjectArray[customerHistory.data[i].date] = [customerHistory.data[i]]
                }
            }
            
            setCustomerHistory(historyObjectArray)
        }

    }, [customerHistory])

    const handleEditHistory = (date: string) => {
        setSelectedDate(date);
        setModalOpen(true);
    }

    const items = () : TimelineItemProps[] => Object.keys(customerItems).map((historyItem) => ({
        label: <>
                <div>{formatDate(historyItem)}</div>
                {
                loggedInUser?.roles?.[0]?.name === 'admin' &&
                <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEditHistory(historyItem)}/>
                }
                </>,
        children: <>
                    <ul>
                    {
                        customerItems[historyItem].map((item: IHistoryItem) => ( 
                            <li key={item.id}>
                                {item.product.sku_name}: <h4>{item.transaction_type === 'in' ? '- (Empties)':'+ (Sale)'} ({item.quantity_transacted})</h4>
                            </li>
                         ))
                    }
                    </ul>
                    <hr />
                    <h3>Total: {
                        customerItems[historyItem].reduce((acc: number, item: IHistoryItem) => {
                            if (item.transaction_type === 'in') {
                                return acc - item.quantity_transacted;
                            }else {
                                return acc + item.quantity_transacted;
                            }
                        }, 0)   
                    }</h3>
                  </>,
      }))
           
    

    return (
        <div>
            <h1>Customer History</h1>
            {
                isLoading ? <Skeleton active /> :
            <>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="Total Empties Balance:" value={
                            customerHistory?.data.reduce((acc: number, item: IHistoryItem) => {
                                if (item.transaction_type === 'in') {
                                    return acc - item.quantity_transacted;
                                }else {
                                    return acc + item.quantity_transacted;
                                }
                            },0)
                        } />
                    </Col>
                </Row>
                <>
                    <Timeline
                        mode={'left'}
                        items={ items() }
                    />
                </>
            </>
            }
            <Modal
                title="Edit History"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => {}}
            >
                Date: { selectedDate }
                <Form>

                </Form>
            </Modal>
        </div>
    )
}

export default CustomerHistory;