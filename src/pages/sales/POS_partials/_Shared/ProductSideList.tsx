import { useState } from 'react';
import { Col, List, Typography, Badge } from 'antd';
import { IProductWithBalance } from '../../../../interfaces/Product';
import { useGetProducts } from '../../hooks/salesHook';
import { useAuthHeader } from 'react-auth-kit';

type Props = {
    onProductClicked: (product: IProductWithBalance) => void
}
const ProductSideList:React.FC<Props> = ({onProductClicked}) => {
    const authHeader = useAuthHeader()

    const {data: products} = useGetProducts(authHeader);

    return (
        <Col style={{border: 1, height: "65vh", borderRadius: 12, overflow: 'scroll'}}>
            <List
                header={<strong>List of Products </strong>}
                footer={"Oppong Kyekyeku LTD"}
                bordered
                dataSource={typeof products != 'undefined' ? products.data : []}
                size="small"
                renderItem={(item: IProductWithBalance, index: number) => 
                    { 
                        return (item.inventory_balance != null && item.inventory_balance.quantity > 0) ?
                                    (<List.Item style={{cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => onProductClicked(item)}>
                                        <Typography.Text>{index + 1} {item.sku_name}</Typography.Text>
                                        <Badge showZero count={(item.inventory_balance != null) ? item.inventory_balance.quantity : 0 } color={(item.inventory_balance != null) ? (item.inventory_balance.quantity > 40) ? "green": (item.inventory_balance.quantity > 22 ? "gold" : "red") : 'red' } />
                                    </List.Item>
                                ) :
                                (   <List.Item style={{display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography.Text style={{color: '#d3d3d3'}}>{index + 1} {item.sku_name}</Typography.Text>
                                        <Badge showZero count={(item.inventory_balance != null) ? item.inventory_balance.quantity : 0 } color={(item.inventory_balance != null) ? (item.inventory_balance.quantity > 40) ? "green": (item.inventory_balance.quantity > 22 ? "gold" : "red") : 'red' } />
                                    </List.Item>
                                )
                    }
                }
            />
        </Col>
    )
}

export default ProductSideList;