import { useAuthHeader } from "react-auth-kit";
import { useQuery } from '@tanstack/react-query';
import { IEmptiesInHouseCount } from "../../interfaces/Empties";
import { ServerResponse } from "../../interfaces/Server";
import { getInHouseEmpties } from "../../services/EmptiesAPI";
import type { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';

const ListInHouseEmpties = () => {
    const authHeader = useAuthHeader();

    const { data: inHouseEmpties } = useQuery<ServerResponse<IEmptiesInHouseCount[]>, Error>({
        queryKey: ['in-house-empties'],
        queryFn: () => getInHouseEmpties(authHeader()),
    });

    const columns: ColumnsType<IEmptiesInHouseCount> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        Table.EXPAND_COLUMN,
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Number of PCs',
            dataIndex: 'number_of_pcs',
            key: 'number_of_pcs',
        }


    ]


    return (
        <>
            <h1>List In House Empties</h1>
        </>
    )
}

export default ListInHouseEmpties;