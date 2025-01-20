import { useState } from "react";
import { Table, Space, Typography, Button } from "antd";
import {useLocation} from 'react-router-dom';
import { ISaleItem } from "../../../../interfaces/Sale";
import { DeleteFilled } from '@ant-design/icons';

const SelectedProducts = () => {
    
    const location = useLocation();
    const [tableContent, setTableContent] = useState<ISaleItem[]>(location.state?.sales ?? []); // [{sku_code: "sku_code", product: "product", quantity: 1, price: 0.00}]

    const removePOSItem = (record: ISaleItem) => {
        setTableContent( (prev) => prev.filter((item) => item.id !== record.id) )
        if (record.product.empty_returnable) updateCustomerEmptiesBalance(record.quantity);
    }

    const posTableColumns = [
        {
            title: '# ('+(tableContent).length+')',
            dataIndex: 'index',
            key: 'index',
            render: (_: any , record: any) => (
                <Space size="middle" key={record.id}>     
                    <Typography.Text>{tableContent.indexOf(record) + 1}</Typography.Text>
                </Space>
            ),
            width: 80
          },
        {
          title: 'SKU Code',
          dataIndex: 'sku_code',
          key: 'sku_code',
          width: 100,
          render: (_: any , record: ISaleItem) => record.product.sku_code.toUpperCase(),
        },
        {
          title: 'Product',
          dataIndex: 'product',
          key: 'product',
          render: (_: any , record: ISaleItem) => record.product.sku_name,
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
            title: 'Price (GHC)',
            dataIndex: 'price',
            key: 'price',
            render: (_: any , record: ISaleItem) => record.product.retail_price && record.product.retail_price,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any , record: ISaleItem) => (
            <Space size="middle">     
                <Button shape="circle" danger icon={<DeleteFilled />} onClick={() => removePOSItem(record)}/>
            </Space>
    ),
        }
    ];

    return (<>
        <Table
            columns={posTableColumns}
            dataSource={tableContent}
            scroll={{ y: 250 }}
            pagination={false}
            onRow={(record, _) => {
                return {
                    onClick: () => {
                        console.log("clicked row: ", record);
                    }, // click rowon
                    // onMouseEnter: (event) => {}, // mouse enter row
                    // onMouseLeave: (event) => {}, // mouse leave row
                };
            }}>

        </Table>
    </>)
}

export default SelectedProducts