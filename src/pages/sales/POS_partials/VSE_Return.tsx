import { useState, useEffect } from "react";
import { Form, AutoComplete, Input, Button, InputNumber, Typography, message, Space } from "antd";
import { ICustomer } from "../../../interfaces/Customer";
import { IProductWithBalance, IProductWithLoadoutBalance } from "../../../interfaces/Product";
import { useQuery } from "@tanstack/react-query";
import { ServerResponse } from "../../../interfaces/Server";
import { getCustomersWithBalance } from "../../../services/CustomersAPI";
import { useAuthHeader } from "react-auth-kit";
import ProductSearch from "./_Shared/ProductSearch";

import { ISaleItem } from "../../../interfaces/Sale";
import { useLoadoutSalePosItems } from "../hooks/salesHook";

type Props = {
    setTableContent: React.Dispatch<React.SetStateAction<ISaleItem[]>>
    setVseReturnSaleItems: React.Dispatch<React.SetStateAction<ISaleItem[]>>
    setFocusedCustomer: React.Dispatch<React.SetStateAction<(ICustomer | null)[] | undefined>>
}

const VSE_Return:React.FC<Props> = ({setTableContent, setVseReturnSaleItems, setFocusedCustomer}) => {
    const authHeader = useAuthHeader();
    const [form] = Form.useForm();
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [selectedProduct, setSelectedProduct] = useState<IProductWithBalance | undefined>();
    const [quantity, setQuantity] = useState<number>(1); 
    const [selectedProducts, setSelectedProducts] = useState<ISaleItem[]>([]);
    const [_selectedvse, setSelectedVse] = useState<ICustomer | undefined>(undefined);
    const [messageApi, contextHolder] = message.useMessage();
    
    const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
                    ['customers-vse'],
                    () => getCustomersWithBalance(authHeader(), { customer_type: 'retailer-vse'} )
    );

    const { data: loadoutSaleItems, refetch } = useLoadoutSalePosItems(authHeader, _selectedvse)

    console.log("LOADOUT SALE ITEMS::", loadoutSaleItems)

    //load only the products and quantities that this vse took!
    console.log("SELECTED VSE::", _selectedvse)
    console.log("LOADOUT SALE ITEMS::", loadoutSaleItems)

    const onCustomerChange = (_: any, option: any) => {
        
        setSelectedVse(option);
        
        setFocusedCustomer((prev) => {
                
            if (!prev) {
                return [option];
            }
            const updatedArray = [...prev];
            
            updatedArray[2] = option;
            
            return updatedArray;
        });
        // form.setFieldValue("unit_price", selectedProduct?.retail_price);
        // setUnitPrice(typeof selectedProduct?.retail_price === 'undefined' ? 0 : selectedProduct?.retail_price);
    }


    const onCustomerSelectedProduct = (product: IProductWithBalance) => {
        form.setFieldValue("unit_price", product.retail_price);
        setUnitPrice(typeof product.retail_price === 'undefined' ? 0 : product.retail_price);
    
        setSelectedProduct(product);
        form.setFieldValue("product", product.sku_name);
    }

    const saveVSEReturn = () => {
        if (typeof selectedProduct !== 'undefined') {
            if (quantity > selectedProduct?.inventory_balance.quantity) {
                messageApi.open({
                    type: 'error',
                    content: "Quantity is greater than the available quantity"
                });
                return;
            }
            setSelectedProducts((prev) => [...prev, {id: selectedProduct.id, product: selectedProduct, quantity: quantity, key: selectedProduct.id} as ISaleItem]);
        }

        form.resetFields([
            'product', 'unit_price', 'quantity'
,        ]);
    }

    useEffect(() => {

        if (_selectedvse && _selectedvse !== undefined) {
            refetch();
        }

    }, [_selectedvse]);


    useEffect(() => {
        if (selectedProducts) {
            setTableContent(selectedProducts);
            setVseReturnSaleItems(selectedProducts);
        }

    },[selectedProducts])

    const formClear = () => {
        form.resetFields();
        setUnitPrice(0);
        setQuantity(1);
        setSelectedProduct(undefined);
    }

    return  (<>
            { contextHolder }
         <Form
            layout={'horizontal'}
            form={form}
            style={{ padding: "2rem"}}
            labelCol={{ flex: '200px' }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            initialValues={{
                'quantity': 1
            }}
        >  
            <Form.Item
                label={'Select VSE'}
            >
                <AutoComplete 
                    allowClear={true}
                    bordered={true}
                    onClear={() => {
                        setSelectedVse(undefined);
                    }}
                    onSelect={(text: string, option: ICustomer) => onCustomerChange(text, option)}
                    placeholder="Search for VSE"
                    options={ customersResponse?.data.map(custmr => ({...custmr, value: `${custmr.name} (${custmr.customer_type.toUpperCase()})`})) }
                    filterOption={(inputValue, option) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    onChange={(val) => {
                        if (val.length === 0) {
                            setSelectedVse(undefined);
                        }
                    }}  
                />
            </Form.Item>
            
            <Form.Item
                label={'Select Product'}
                name={"product"}
            >
                <ProductSearch 
                    onProductSelected={(product) => onCustomerSelectedProduct(product)}
                    cachedLoadoutProducts={ 
                        loadoutSaleItems && loadoutSaleItems?.map(item => {
                            return {
                                ...item.product,
                                key: item.product.id,
                                inventory_balance: {
                                    quantity: item.quantity
                                }
                            } as IProductWithLoadoutBalance
                        }
                    ) || []   
                }    
                disabled={_selectedvse === undefined || loadoutSaleItems === undefined}
                />
            </Form.Item>
            <hr />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <Form.Item name={"unit_price"} label={`Unit Price: ${typeof unitPrice === 'undefined'? "0.00" : unitPrice} GHC`}>
                    <Input placeholder="Unit Price" value={unitPrice} readOnly/>
                </Form.Item>
                <Form.Item label="Quantity:" name="quantity">
                    <InputNumber min={1} onChange={(val) => setQuantity( val === null ? 1 : val  )}/>
                </Form.Item>
                <Form.Item label="Price">
                    <Typography className="ant-form-text">{(unitPrice * quantity).toFixed(2)} GHC</Typography>
                </Form.Item>
            </div>
            <Space wrap>
                <Button size={"large"} type="primary" onClick={saveVSEReturn} disabled={(typeof selectedProduct === 'undefined') } >Save</Button>
                <Button size={"large"} onClick={() => formClear()}>Clear</Button>
            </Space>
            

        </Form>
    </>
    );
}

export default VSE_Return;