import React, { useEffect } from 'react';
import TableEmptiesReturnedLog from '../../components/TableEmptiesReturnedLog';
import { ServerResponse } from '../../interfaces/Server';
import { IEmptyReturnedLog } from '../../interfaces/Empties';
import { IEmptyLog } from '../../interfaces/Empties';
import { getEmptiesLog } from '../../services/EmptiesAPI';
import { useQuery } from '@tanstack/react-query';
import { getEmptiesReturnedLog } from '../../services/EmptiesAPI';
import type { ColumnsType } from 'antd/es/table';
import { Card, Table } from 'antd';
import { DatePicker, Row, Col, Statistic } from 'antd';
import { useAuthToken } from '../../hooks/auth';

const { RangePicker } = DatePicker;
const ReturningEmptiesLog: React.FC = () => {
    const authToken = useAuthToken();

    //use react query to fetch data from server
    const { data: returnedEmpties } = useQuery<ServerResponse<IEmptyReturnedLog[]>, Error>(
        ['empties_returned'],
        () => getEmptiesReturnedLog(authToken)
    );

    const { data: receivedEmpties } = useQuery<ServerResponse<IEmptyLog[]>, Error>(
        ['empties_received'],
        () => getEmptiesLog(authToken)
    );


    const [emptiesReturnedLog, setEmptiesReturnedLog] = React.useState<IEmptyReturnedLog[] | undefined>(undefined);
    const [emptiesReceivedLog, setEmptiesReceivedLog] = React.useState<IEmptyLog[] | undefined>(undefined);
    const [dateRange, setDateRange] = React.useState<string[] | undefined>(undefined);
    let emptiesBalance = (emptiesReceivedLog && emptiesReturnedLog) ? emptiesReturnedLog.reduce((acc: number, item: IEmptyReturnedLog) => acc + item.quantity, 0) - emptiesReceivedLog.reduce((acc: number, item: IEmptyLog) => acc + item.quantity_received, 0)  : 0;

    useEffect(() => {
        if (returnedEmpties) {
            setEmptiesReturnedLog(returnedEmpties.data
                ?.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
                ?.map((item) => ({
                    ...item,
                    key: item.id})
                )
            );
        }

        if (receivedEmpties) {
            setEmptiesReceivedLog(receivedEmpties.data
                ?.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
            ?.map((item) => ({
                    ...item,
                    key: item.id})
                )
            );
        }
    },[returnedEmpties, receivedEmpties]);

    useEffect(() => {

        if (dateRange) {
            
            let [start, end] = dateRange;
            let filteredData = returnedEmpties?.data?.filter((item) => {
                let date = new Date(item.date);
                let startDate = new Date(start);
                let endDate = new Date(end);
                return date >= startDate && date <= endDate;
            });
            setEmptiesReturnedLog(filteredData?.map((item) => ({
                    ...item,
                    key: item.id})
                )
            );
        }

    }, [dateRange])

    const dateRangeOnChange = (_: any, dateString: string[]) => {
        setDateRange(dateString);
    }

    const columns: ColumnsType<IEmptyReturnedLog> = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        Table.EXPAND_COLUMN,
        { title: 'Quanity Returned', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Vehicle Number', dataIndex: 'vehicle_number', key: 'vehicle_number' },
        { title: 'Returned By', dataIndex: 'returned_by', key: 'returned_by' },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: () => <a>Delete</a>,
        },
      ];

    return (
        <>
            Select a date Range <RangePicker onChange={dateRangeOnChange}/>
            <Row gutter={16}>
                <Col span={12}>
                    <Card bordered={true}>
                        <Statistic
                            title="Quantity Returned"
                            value={emptiesReturnedLog ? emptiesReturnedLog.reduce((acc: number, item: IEmptyReturnedLog) => acc + item.quantity, 0) : 0}
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
                            valueStyle={{ color: emptiesBalance< 0 ? '#ff0000':'#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>
            </Row>
            <TableEmptiesReturnedLog columns={columns} data={emptiesReturnedLog} />
        </>
    ); 
}

export default ReturningEmptiesLog;