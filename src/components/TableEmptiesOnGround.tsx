import React from 'react';
import { Table } from 'antd';
import { IEmptyOnGroundProducts } from '../interfaces/Product';

type TableEmptiesOnGroundProps = {
    columns: any;
    data: any;
    isDataLoading: boolean;
}

const TableEmptiesOnGround: React.FC<TableEmptiesOnGroundProps> = ({columns, data, isDataLoading}) => 

    (
    <Table
        columns={columns}
        expandable={{
        expandedRowRender: (record) => <Table columns={[{ title: 'SKU', dataIndex: 'sku_name', key: 'sku' },
            { title: 'SKU Code', dataIndex: 'sku_code', key: 'sku_code' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'Is Empty', dataIndex: 'is_empty', key: 'is_empty' },
            ]}
            dataSource={
                (
                    record.empties_on_ground_products.length > 0 
                    ? 
                    record.empties_on_ground_products.map((p: IEmptyOnGroundProducts) => (
                {   
                    sku_code: p.product.sku_code, 
                    sku_name: p.product.sku_name, 
                    key: p.product.id,
                    quantity: p.quantity,
                    is_empty: p.is_empty ? 'Yes' : 'No'
                }
                )) 
                : [])
            }
            pagination={false}
        />,
        rowExpandable: (record) => record.empties_on_ground_products.length > 0,
        }}
        dataSource={data}
        loading={isDataLoading}
    />
)

export default TableEmptiesOnGround