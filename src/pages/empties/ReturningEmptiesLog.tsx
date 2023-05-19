import React, { useEffect } from 'react';
import TableEmptiesReturnedLog from '../../components/TableEmptiesReturnedLog';
import { ServerResponse } from '../../interfaces/Server';
import { IEmptyReturnedLog } from '../../interfaces/Empties';
import { useQuery } from '@tanstack/react-query';
import { getEmptiesReturnedLog } from '../../services/EmptiesAPI';
import type { ColumnsType } from 'antd/es/table';
import { Card, Table } from 'antd';
import { DatePicker, Row, Col, Statistic } from 'antd';
const { RangePicker } = DatePicker;
const ReturningEmptiesLog: React.FC = () => {

    //use react query to fetch data from server
    const { data } = useQuery<ServerResponse<IEmptyReturnedLog[]>, Error>(
        ['empties'],
        () => getEmptiesReturnedLog("")
    );

    const [emptiesReturnedLog, setEmptiesReturnedLog] = React.useState<IEmptyReturnedLog[] | undefined>(undefined);
    const [dateRange, setDateRange] = React.useState<string[] | undefined>(undefined);

    useEffect(() => {
        if (data) {
            setEmptiesReturnedLog(data.data?.map((item) => ({
                    ...item,
                    key: item.id})
                )
            );
        }
    },[data]);

    useEffect(() => {

        if (dateRange) {
            console.log(dateRange);
            let [start, end] = dateRange;
            let filteredData = data?.data?.filter((item) => {
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

    const dateRangeOnChange = (date: any, dateString: string[]) => {
        console.log(date, dateString);
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
                            value={-123}
                            valueStyle={{ color: '#ff0000' }}
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