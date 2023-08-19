import { Timeline, TimelineItemProps, Col, Row, Statistic } from 'antd';
import { useQuery } from "@tanstack/react-query";
import { useAuthHeader } from "react-auth-kit";
import { getCustomerHistory } from '../../services/CustomersAPI';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IHistoryItem } from '../../interfaces/Customer';

const CustomerHistory = () => {
    const authHeader = useAuthHeader();
    const [customerItems, setCustomerHistory] = useState({}) as any
    const { id } = useParams();

    const customerID  = id ? parseInt(id) : 0;

    const { data: customerHistory } = useQuery(
        {
            queryKey: ['customer_history'],
            queryFn: () => getCustomerHistory(customerID, authHeader())
        }
    );

    console.log("Customer Hsoty: ", customerHistory)
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
            console.log("HISOTRY OBJECT::", historyObjectArray)
            setCustomerHistory(historyObjectArray)
        }

    }, [customerHistory])

    const items = () : TimelineItemProps[] => Object.keys(customerItems).map((historyItem) => ({
        label: historyItem,
        children: <>
                    {
                        customerItems[historyItem].map((item: IHistoryItem) => ( 
                            <p key={item.id}>
                                {item.product.sku_name}: <h4>{item.transaction_type === 'in' ? '-':'+'} ({item.quantity_transacted})</h4>
                            </p>
                         ))
                    }
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
        </div>
    )
}

export default CustomerHistory;