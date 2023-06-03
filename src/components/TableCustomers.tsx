import React from 'react';
import { Table } from 'antd';
import { ICustomer } from '../interfaces/Customer';

type TableCustomersProps = {
    columns :any,
    data: ICustomer[] | undefined

}

const TableCustomers: React.FC<TableCustomersProps> = ({columns, data}) => (

    <Table
        columns={columns}
        dataSource={data}
    />
);

export default TableCustomers;