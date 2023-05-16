import React, { useEffect } from 'react';
import TableEmptiesReturnedLog from '../../components/TableEmptiesReturnedLog';
import { ServerResponse } from '../../interfaces/Server';
import { IEmptyReturnedLog } from '../../interfaces/Empties';
import { useQuery } from '@tanstack/react-query';
import { getEmptiesReturnedLog } from '../../services/EmptiesAPI';
import type { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';

const ReturningEmptiesLog: React.FC = () => {

    //use react query to fetch data from server
    const { isLoading, error, data } = useQuery<ServerResponse<IEmptyReturnedLog[]>, Error>(
        ['empties'],
        () => getEmptiesReturnedLog("")
    );

    const [emptiesReturnedLog, setEmptiesReturnedLog] = React.useState<IEmptyReturnedLog[] | undefined>(undefined);

    useEffect(() => {
        if (data) {
            setEmptiesReturnedLog(data.data?.map((item) => ({
                    ...item,
                    key: item.id})
                )
            );
        }
    },[data]);

    const columns: ColumnsType<IEmptyReturnedLog> = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        Table.EXPAND_COLUMN,
        { title: 'Quanity Returned', dataIndex: 'quantity_returned', key: 'quantity_returned' },
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
            <TableEmptiesReturnedLog columns={columns} data={emptiesReturnedLog} />
        </>
    ); 
}

export default ReturningEmptiesLog;