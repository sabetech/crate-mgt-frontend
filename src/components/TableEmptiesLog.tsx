import React from 'react';
import { Table } from 'antd';
import { IEmptyLog } from '../interfaces/Empties';


type TableEmptiesLogProps = {
    columns: any;
    data: IEmptyLog[] | undefined;
}

const TableEmptiesLog: React.FC<TableEmptiesLogProps> = ({columns, data}) => (
  <Table
    columns={columns}
    expandable={{
      expandedRowRender: (record) => <Table columns={[{ title: 'SKU', dataIndex: 'sku', key: 'sku' },
      { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
      ]}
      dataSource={[{ key: 1, sku: '123456', quantity: 1 }]}
      />,
      rowExpandable: (record) => record.products.length > 0,
    }}
    dataSource={data}
  />
);

export default TableEmptiesLog;