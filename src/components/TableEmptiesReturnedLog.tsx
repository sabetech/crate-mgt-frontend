import React from 'react';
import { Table } from 'antd';
import { IEmptyReturnedLog } from '../interfaces/Empties';


type TableEmptiesLogProps = {
    columns: any;
    data: IEmptyReturnedLog[] | undefined;
}

const TableEmptiesReturnedLog: React.FC<TableEmptiesLogProps> = ({columns, data}) => (
  <Table
    columns={columns}
    expandable={{
      expandedRowRender: (record) => <Table columns={[{ title: 'SKU', dataIndex: 'sku_name', key: 'sku' },
      { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
      ]}
      dataSource={(record.products.length > 0 ? record.products.map(p => ({...p, quantity:p.pivot?.quantity, key: p.id})) : [])}
      pagination={false}
      />,
      rowExpandable: (record) => record.products.length > 0,
      
    }}
    dataSource={data}
  />
);

export default TableEmptiesReturnedLog;