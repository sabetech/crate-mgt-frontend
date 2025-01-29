import { useEffect, useState } from "react";
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
import { ICustomer } from "../../interfaces/Customer";
import OrderSummary from "./POS_partials/_Shared/OrderSummary";
import * as constants from "../../utils/constants";

const POS = () => {

    const [customerSaleItems, setCustomerSaleItems] = useState<ISaleItem[]>([]);
    const [vseSaleItems, setVseSaleItems] = useState<ISaleItem[]>([]);
    const [vseReturnSaleItems, setvseReturnSaleItems] = useState<ISaleItem[]>([]);
    const [customerSaleReturnItems, setcustomerSaleReturnItems] = useState<ISaleItem[]>([]);

    const [tableContent, setTableContent] = useState<ISaleItem[]>([]);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);

    const [focusedCustomer, setFocusedCustomer] = useState<(ICustomer | null)[] | undefined>();

    const [orderDetails, setOrderDetails] = useState({
        quantity: 0,
        totalCost: 0
    })
    
    const onProductClicked = (product: IProductWithBalance) => {
        
    }

    useEffect(() => {
        let _quantity = 0;
        let _totalCost = 0;
        tableContent.map((item) => {
            _quantity += item.quantity;
            if (focusedCustomer && focusedCustomer[selectedTabIndex]?.customer_type === constants.WHOLESALER ) {
                if (item.product.wholesale_price) {
                    _totalCost += (item.quantity * item.product.wholesale_price);
                }                
            }

            if (focusedCustomer && focusedCustomer[selectedTabIndex]?.customer_type === constants.RETAILER ) {
                if (item.product.retail_price) {
                    _totalCost += (item.quantity * item.product.retail_price);
                }
            }

            if (focusedCustomer && focusedCustomer[selectedTabIndex]?.customer_type === constants.RETAILER_VSE ) {
                if (item.product.wholesale_price) {
                    _totalCost += (item.quantity * item.product.wholesale_price);
                }                
            }
            
        });

        setOrderDetails({
            quantity: _quantity,
            totalCost: _totalCost
        })

    }, [tableContent]);

    console.log("Focused customer::", focusedCustomer)

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
                            size={'large'}
                            onChange={(key) => {
                                switch(key) {
                                    case '1':
                                        setTableContent(customerSaleItems)
                                        setSelectedTabIndex(0)
                                    break;

                                    case '2':
                                        setTableContent(vseSaleItems)
                                        setSelectedTabIndex(1)
                                    break;
                                    
                                    case '3':
                                        setTableContent(vseReturnSaleItems)
                                        setSelectedTabIndex(2)
                                    break;
                                    
                                    case '4':
                                        setTableContent(customerSaleReturnItems)
                                        setSelectedTabIndex(3)
                                    break;
                                }
                            }}
                            items={[
                                {
                                    label: 'Customer',
                                    key: '1',
                                    children: <POS_Customer 
                                                    setTableContent={setTableContent} 
                                                    setCustomerSaleItems={setCustomerSaleItems}
                                                    setFocusedCustomer={setFocusedCustomer}
                                                    />

                                },
                                {
                                    label: 'VSE Loadout',
                                    key: '2',
                                    children: <VSE_Loadout 
                                                setTableContent={setTableContent} 
                                                setVseSaleItems={setVseSaleItems}
                                                setFocusedCustomer={setFocusedCustomer}
                                                />
                                },
                                {
                                    label: 'VSE Return',
                                    key: '3',
                                    children: <VSE_Return 
                                                setTableContent={setTableContent}
                                                setVseReturnSaleItems={setvseReturnSaleItems}
                                                setFocusedCustomer={setFocusedCustomer}
                                                />
                                },
                                {
                                    label: 'Customer Modify Sale',
                                    key: '4',
                                    children: <POS_Customer_Edit_sale 
                                                setTableContent={setTableContent}
                                                setcustomerSaleReturnItems={setcustomerSaleReturnItems}
                                                setFocusedCustomer={setFocusedCustomer}
                                                />
                                },

                            ]}
                        /> 
                        <SelectedProducts tableContent={tableContent} setTableContent={setTableContent} />
                    </div>
                    
                </Col>
                <Col span={5}>

                    <OrderSummary 
                        tableContent={tableContent} 
                        customer={focusedCustomer ? focusedCustomer[selectedTabIndex] : null} 
                        orderDetails={orderDetails} 
                    />

                </Col>
            </Row>
        </>
}

export default POS;