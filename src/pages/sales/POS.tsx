import { useState } from "react";
import { Row, Col, Tabs } from "antd";
import { ISaleItem } from "../../interfaces/Sale";
import ProductSideList from "./POS_partials/_Shared/ProductSideList";
import POS_HelpInfo from "./POS_partials/POS_HelpInfo";
import POS_Customer from "./POS_partials/POS_Customer";
import VSE_Loadout from "./POS_partials/VSE_loadout";
import VSE_Return from "./POS_partials/VSE_Return";
import POS_Customer_Edit_sale from "./POS_partials/POS_Customer_Edit_Sale";
import SelectedProducts from "./POS_partials/_Shared/SelectedProducts";
import { IProductWithBalance } from "../../interfaces/Product";
import { TagsOutlined } from '@ant-design/icons';


const POS = () => {

    const [customerSaleItems, setCustomerSaleItems] = useState<ISaleItem[]>([]);
    const [vseSaleItems, setVseSaleItems] = useState<ISaleItem[]>([]);

    const [tableContent, setTableContent] = useState<ISaleItem[]>([]);
    const onProductClicked = (product: IProductWithBalance) => {
        
    }

    return <>
            <Row>
                <POS_HelpInfo />
                <Col>
                    <ProductSideList onProductClicked={onProductClicked} />
                </Col>
                <Col>
                    <div style={{
                                borderStyle: "solid",
                                borderWidth: "1px",
                                borderRadius: 2,
                                borderColor: "#D9D9D9",
                                backgroundColor: "#f3f1f1",
                                width: "45vw",
                            }}>
                        <Tabs 
                            style={{marginLeft: 20}}
                            defaultActiveKey='1'
                            size={'small'}
                            onChange={(key) => {
                                switch(key) {
                                    case '1':
                                        setTableContent(customerSaleItems)
                                    break;

                                    case '2':
                                        setTableContent(vseSaleItems)
                                    break;
                                }
                            }}
                            items={[
                                {
                                    label: 'Customer',
                                    key: '1',
                                    children: <POS_Customer 
                                                    setTableContent={setTableContent} 
                                                    setCustomerSaleItems={setCustomerSaleItems}/>

                                },
                                {
                                    label: 'VSE Loadout',
                                    key: '2',
                                    children: <VSE_Loadout 
                                                setTableContent={setTableContent} 
                                                setVseSaleItems={setVseSaleItems}
                                                />
                                },
                                {
                                    label: 'VSE Return',
                                    key: '3',
                                    children: <VSE_Return />
                                },
                                {
                                    label: 'Customer Modify Sale',
                                    key: '4',
                                    children: <POS_Customer_Edit_sale />
                                },

                            ]}
                        /> 
                        <SelectedProducts tableContent={tableContent} setTableContent={setTableContent} />
                    </div>
                    
                </Col>

                
                            

                
            </Row>
        </>
}

export default POS;