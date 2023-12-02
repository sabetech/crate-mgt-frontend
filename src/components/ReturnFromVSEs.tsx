import { useState } from "react";
import { Form, DatePicker, AutoComplete, Button, message, Divider, Row, Col, Typography, Tag, InputNumber, Empty } from "antd";
import type { DatePickerProps } from 'antd';
import { getVSEWithLoadoutInfo } from '../services/CustomersAPI';
import { ILoadoutInfo } from "../interfaces/Inventory";
import { ICustomer, IVSECustomer } from '../interfaces/Customer';
import { useQuery, useMutation } from '@tanstack/react-query'
import { ServerResponse } from '../interfaces/Server';
import { getCustomers } from '../services/CustomersAPI';
import { useAuthHeader } from 'react-auth-kit'
import { IReturnsFromVSERequest } from "../interfaces/Inventory";
import { addReturnsFromVSEs } from "../services/InventoryAPI";
import { AppError } from "../interfaces/Error";


const ReturnFromVSEs = () => {
    const [form] = Form.useForm();
    const [date, setDate] = useState<string>();
    const [vse, setVse] = useState<ICustomer>();
    const [messageApi, contextHolder ] = message.useMessage();
    const authHeader = useAuthHeader();

    const { data: loadoutInfo } = useQuery<ServerResponse<IVSECustomer>, Error>(
        ['loadout_info', vse],
        () => {
            if ((vse?.id) && (date))
                return getVSEWithLoadoutInfo(vse?.id, date, authHeader())
            return Promise.resolve({data: []})
        }
    )

    const { mutate } = useMutation({
        mutationFn: (values: IReturnsFromVSERequest) => addReturnsFromVSEs(values, authHeader()),
        onSuccess: (data) => {
            success(data.data || "")
            form.resetFields();
        },
        onError: (error: AppError) => {
            messageApi.open({
                type: 'error',
                content: error.message + ". Please Check your internet connection and refresh the page."
            });
            setTimeout(messageApi.destroy, 2500);
        }
    });

    const onChange: DatePickerProps['onChange'] = (_, dateString) => {
        setDate(dateString);
    };

    const success = (msg:string) => {
        messageApi.destroy();
        messageApi.success(msg, 2.5);
    }

    const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
        ['customers'],
        () => getCustomers(authHeader(), {customer_type: 'retailer-vse'})
    )

    const onFinish = (formValues: any) => {
        console.log("FORM VALUES:::", formValues);

        const returnFromVSEs = {    
            date: date,
            vse: vse?.id,
            products: formValues.products
        } as IReturnsFromVSERequest;

        console.log("REQUEST:::",returnFromVSEs);

        // mutate(returnFromVSEs);

    }

    const onFinishedFailed = (_: any) => {

    }

    const onCustomerChange = (_: string, option: ICustomer) => {        
        setVse(option)
    }

    const onSearch = (value: string) => {
        console.log('searching ...:', value);
    };

    return (
        <>
        {contextHolder}
            <Form
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishedFailed}
                layout={'vertical'}
                style={{ maxWidth: '90%' }}
                size="large"
            >
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '80px'}}>
                    <div>
                        <Form.Item label={"Date"} name={"date"} rules={[{required: true, message: 'Please Choose Date'}]}>
                            <DatePicker onChange={onChange} />
                        </Form.Item>
                
                        <Form.Item
                            label="VSE"
                            name="vse"
                            rules={[{ required: true, message: 'Please Enter VSE' }]}
                            >
                             <AutoComplete 
                                    allowClear={true}
                                    bordered={false}
                                    onSearch={onSearch}
                                    onChange={(text: string, option: any) => onCustomerChange(text, option)}
                                    placeholder="Search for VSE"
                                    options={ customersResponse?.data.map(custmr => ({...custmr, value: `${custmr.name} (${custmr.customer_type.toUpperCase()})`})) }
                                    filterOption={(inputValue, option) =>
                                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                      }
                                />
                        </Form.Item>
                    </div>
                    <div>
                        <Divider orientation="left">VSE Loadout Info - {vse?.name}</Divider>
                        {
                            loadoutInfo?.data.vse_loadout && loadoutInfo?.data.vse_loadout.length > 0 && loadoutInfo.data?.vse_loadout.map((vseloadout: ILoadoutInfo) => (
                            <div key={vseloadout.id}>
                                <Row gutter={5} style={{padding: '0px'}}>
                                    <Col className="gutter-row" span={10} style={{padding: 10}}>
                                        <Typography.Text strong>{ vseloadout.product.sku_name }</Typography.Text>
                                        <Form.Item hidden={true} name={`product_${vseloadout.product.id}`} initialValue={vseloadout.product.id} />
                                        <div ><Tag color="gold">Quantity Given: { vseloadout.quantity }</Tag></div>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        <Form.Item 
                                            label="Quantity Returned"
                                            name={`product_${vseloadout.product.id}_returned`}
                                            rules={[{ required: true, message: 'Please Enter Quantity' }]}
                                            style={{margin: 0}}
                                            initialValue={vseloadout.returned ?? 0}
                                        >
                                            <InputNumber placeholder="0"/>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                            </div>
                            )) || (<Empty />)
                        }
                    </div>
                </div>
                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            
            </Form>
        </>
    )
}

export default ReturnFromVSEs;