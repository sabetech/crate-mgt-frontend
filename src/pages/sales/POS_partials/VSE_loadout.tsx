import { Form, AutoComplete } from "antd";
import { ServerResponse } from "../../../interfaces/Server";
import { ICustomer } from "../../../interfaces/Customer";
import { useQuery } from "@tanstack/react-query";
import { getCustomersWithBalance } from "../../../services/CustomersAPI";
import { useAuthHeader } from "react-auth-kit";

const VSE_Loadout = () => {
    const authHeader = useAuthHeader();
    const [form] = Form.useForm();

     const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
                ['customers'],
                () => getCustomersWithBalance(authHeader(), { customer_type: 'vse'} )
        );

    const onCustomerChange = (text, option) => {

    }

    return (<>
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
                    onSelect={(text: string, option: ICustomer) => onCustomerChange(text, option)}
                    placeholder="Search for Customer"
                    options={ customersResponse?.data.map(custmr => ({...custmr, value: `${custmr.name} (${custmr.customer_type.toUpperCase()})`})) }
                    filterOption={(inputValue, option) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                />
            </Form.Item>
            
            <Form.Item
                label={'Select Product'}
            >
                <ProductSearch customer={customer}/>
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
                <Button size={"large"} type="primary" onClick={savePurchase} disabled={(typeof selectedProduct === 'undefined') } >Save</Button>
                <Button size={"large"} onClick={() => formClear()}>Clear</Button>
            </Space>
            

        </Form>
    </>)
}

export default VSE_Loadout