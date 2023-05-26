import React, { useEffect } from 'react';
import TableEmptiesLog from '../../components/TableEmptiesLog';
import { ServerResponse } from '../../interfaces/Server';
import { IEmptyLog, IEmptyReturnedLog } from '../../interfaces/Empties';
import { useQuery } from '@tanstack/react-query';
import { getEmptiesLog, getEmptiesReturnedLog } from '../../services/EmptiesAPI';
import type { ColumnsType } from 'antd/es/table';
import { Table, Image, DatePicker, Row, Col, Statistic, Card, Tag} from 'antd';
import { useSignOut, useAuthHeader } from 'react-auth-kit';
const { RangePicker } = DatePicker;

const EmptiesLog: React.FC = () => {
    const authHeader = useAuthHeader();
    const signOut = useSignOut();
    //use react query to fetch data from server
    const { error: emptiesReceivedError, data: receivedEmpties } = useQuery<ServerResponse<IEmptyLog[]>, Error>(
        ['empties_received'],
        () => getEmptiesLog(authHeader())
    );

    const { data: returnedEmpties } = useQuery<ServerResponse<IEmptyReturnedLog[]>, Error>(
        ['empties_returned'],
        () => getEmptiesReturnedLog(authHeader())
    );

    if (emptiesReceivedError) {
        //DONT FORGET TO HANDLE THIS >> VERY IMPORTANT
        if (emptiesReceivedError.response.status === 401) {
            signOut();
        }
    }

    const [emptiesLog, setEmptiesLog] = React.useState<IEmptyLog[] | undefined>(undefined);
    const [emptiesReturnedLog, setEmptiesReturnedLog] = React.useState<IEmptyReturnedLog[] | undefined>(undefined);
    let emptiesBalance = (emptiesLog && emptiesReturnedLog) ? emptiesReturnedLog.reduce((acc: number, item: IEmptyReturnedLog) => acc + item.quantity, 0) - emptiesLog.reduce((acc: number, item: IEmptyLog) => acc + item.quantity_received, 0) : 0
    const [dateRange, setDateRange] = React.useState<string[] | undefined>(undefined);

    useEffect(() => {
        if (receivedEmpties) {
            setEmptiesLog(receivedEmpties.data?.map((item) => ({
                    ...item,
                    key: item.id})
                )
            );
        }
        if (returnedEmpties) {
            setEmptiesReturnedLog(returnedEmpties.data?.map((item) => ({
                ...item,
                key: item.id})
            ));
        }

    },[receivedEmpties, returnedEmpties]);

    useEffect(() => {

        if (dateRange) {
            console.log(dateRange);
            let [start, end] = dateRange;
            let filteredData = receivedEmpties?.data?.filter((item) => {
                let date = new Date(item.date);
                let startDate = new Date(start);
                let endDate = new Date(end);
                return date >= startDate && date <= endDate;
            });
            setEmptiesLog(filteredData?.map((item) => ({
                    ...item,
                    key: item.id})
                )
            );
        }

    }, [dateRange])

    const dateRangeOnChange = (date: any, dateString: string[]) => {
        console.log(date, dateString);
        setDateRange(dateString);
    }

    const columns: ColumnsType<IEmptyLog> = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        Table.EXPAND_COLUMN,
        { title: 'Quanity Received', dataIndex: 'quantity_received', key: 'quantity_received' },
        { title: 'Vehicle Number', dataIndex: 'vehicle_number', key: 'vehicle_number' },
        { title: 'Purchse Order Number', dataIndex: 'purchase_order_number', key: 'purchase_order_number' },
        { title: 'Received By', dataIndex: 'received_by', key: 'received_by' },
        { title: 'Delivered By', dataIndex: 'delivered_by', key: 'delivered_by' },
        { title: 'Image Reference', dataIndex: 'image_reference', key: 'image_reference', render: (value) => (<Image width={200} src={value} />) },
        {
          title: 'Action',
          dataIndex: 'approved',
          key: 'x',
          render: (value) => <>
            {(value === 0 ? <Tag color="error">Unapproved</Tag> : <Tag color="success">Approved</Tag>)}
            <a>Delete</a>
          </>,
        },
      ];

    return (
        <>
            Select a date Range <RangePicker onChange={dateRangeOnChange}/>
            <Row gutter={16}>
                <Col span={12}>
                    <Card bordered={true}>
                        <Statistic
                            title="Quantity Received"
                            value={emptiesLog ? emptiesLog.reduce((acc: number, item: IEmptyLog) => acc + item.quantity_received, 0) : 0}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={true}>
                        <Statistic
                            title="Quantity Balance"
                            value={emptiesBalance}
                            valueStyle={{ color: emptiesBalance < 0?'#ff0000':'#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>
            </Row>
            <TableEmptiesLog columns={columns} data={emptiesLog} />
        </>
    ); 
}

export default EmptiesLog;