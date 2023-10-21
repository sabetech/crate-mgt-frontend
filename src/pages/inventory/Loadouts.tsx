import type { DatePickerProps } from 'antd';
import { Form, DatePicker, Input, Button, AutoComplete } from "antd";
import { SendOutlined } from '@ant-design/icons';
import AddProductQuantityFields from '../../components/AddProductQuantityFields';
import { getCustomers } from '../../services/CustomersAPI'
import { ICustomer } from '../../interfaces/Customer'
import { ServerResponse } from '../../interfaces/Server';
import { useQuery } from '@tanstack/react-query'
import { useAuthHeader } from 'react-auth-kit'

const Loadouts = () => {
    const [form] = Form.useForm();
    const authHeader = useAuthHeader();
    const onChange: DatePickerProps['onChange'] = (date: any, dateString: any) => {

    }

    const onCustomerChange = (value: string, option: ICustomer) => {
        console.log(`selected Customer ${value}:::`, option);

    }

    const { data: customersResponse } = useQuery<ServerResponse<ICustomer[]>, Error>(
        ['customers'],
        () => getCustomers(authHeader(), {customer_type: 'retailer-vse'})
    )

    const onSearch = (value: string) => {
        console.log('searching ...:', value);
    };

    return (
        <>
            <h1>Loadouts</h1>
            <Form
                form={form}
                layout={'vertical'}
                style={{ maxWidth: '90%' }}
                size={'large'}
            >
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '80px'}}>
                    <div>
                        <Form.Item
                            label="Date"
                            name="date"
                            rules={[{ required: true, message: 'Please Choose Date' }]}
                            >
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
                        <AddProductQuantityFields is_returnable={false} />
                    </div>
                </div>

                <Form.Item >
                    <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                        Submit
                    </Button>
                </Form.Item>

            </Form>
            
        </>
    )
}

export default Loadouts;