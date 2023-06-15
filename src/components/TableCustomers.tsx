import React from 'react';
import { Table } from 'antd';
import { ICustomer } from '../interfaces/Customer';

type TableCustomersProps = {
    columns :any,
    data: ICustomer[] | undefined,
    isLoading: boolean

}

const TableCustomers: React.FC<TableCustomersProps> = ({isLoading, columns, data}) => (

    <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
    />
);

export default TableCustomers;