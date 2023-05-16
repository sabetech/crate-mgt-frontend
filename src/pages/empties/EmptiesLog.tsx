import React, { useEffect } from 'react';
import TableEmptiesLog from '../../components/TableEmptiesLog';
import { ServerResponse } from '../../interfaces/Server';
import { IEmptyLog } from '../../interfaces/Empties';
import { useQuery } from '@tanstack/react-query';
import { getEmptiesLog } from '../../services/EmptiesAPI';
import type { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';

const EmptiesLog: React.FC = () => {

    //use react query to fetch data from server
    const { isLoading, error, data } = useQuery<ServerResponse<IEmptyLog[]>, Error>(
        ['empties'],
        () => getEmptiesLog("")
    );

    const [emptiesLog, setEmptiesLog] = React.useState<IEmptyLog[] | undefined>(undefined);

    useEffect(() => {
        if (data) {
            setEmptiesLog(data.data?.map((item) => ({
                    ...item,
                    key: item.id})
                )
            );
        }
    },[data]);

    console.log("EMPTIES LOG:::", emptiesLog);

    const columns: ColumnsType<IEmptyLog> = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        Table.EXPAND_COLUMN,
        { title: 'Quanity Received', dataIndex: 'quantity_received', key: 'quantity_received' },
        { title: 'Vehicle Number', dataIndex: 'vehicle_number', key: 'vehicle_number' },
        { title: 'Purchse Order Number', dataIndex: 'purchase_order_number', key: 'purchase_order_number' },
        { title: 'Received By', dataIndex: 'received_by', key: 'received_by' },
        { title: 'Delivered By', dataIndex: 'delivered_by', key: 'delivered_by' },
        { title: 'Image Reference', dataIndex: 'image_reference', key: 'image_reference' },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: () => <a>Delete</a>,
        },
      ];

    return (
        <>
            <TableEmptiesLog columns={columns} data={emptiesLog} />
        </>
    ); 
}

export default EmptiesLog;