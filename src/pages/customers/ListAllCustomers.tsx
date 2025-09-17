import React, { useEffect, useState } from "react";
import { Button, Input, Space, Tooltip, Modal, message, Form, Dropdown } from "antd";
import { EditOutlined, DeleteOutlined, DownOutlined } from "@ant-design/icons";
import TableCustomers from "../../components/TableCustomers";
import { useAuthToken } from "../../hooks/auth";
import { ICustomer, ICustomerReturnEmpties } from "../../interfaces/Customer";
import { ServerResponse } from "../../interfaces/Server";
import { getCustomersWithBalance, removeCustomer } from "../../services/CustomersAPI";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { WHOLESALER } from "../../utils/constants";
import { AppError } from "../../interfaces/Error";
import { useQueryClient } from "@tanstack/react-query";
import type { MenuProps } from 'antd';


const { Search } = Input;
const ListCustomers: React.FC = () => {
    const authToken = useAuthToken();
    const [filterByVSE, toggleFilterByVSE] = useState<boolean>(false);
    const [filterByWholesaler, toggleFilterByWholesaler] = useState<boolean>(false);
    const [customerList, setCustomerList] = React.useState<ICustomer[] | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerTobeEdited, setCustomerTobeEdited] = useState<ICustomer | null>(null);
    const [customerType , setCustomerType] = useState<string>("");
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient()
    const [form] = Form.useForm();

    const { data, isLoading } = useQuery<ServerResponse<ICustomer[]>, Error>(
        {
            queryKey: ['customer_with_balance'],
            queryFn: () => getCustomersWithBalance(authToken ?? "", {customer_type: 'all'}),
            onError: (error: Error) => {
                console.log(error);
            }
        }
    )
     
    useEffect(() => {
        if (data) {
            setCustomerList(data.data?.map((item) => ({
                ...item,
                key: item.id
            })
            ));
        }
    },[data]);

    useEffect(() => {
        if (!customerList) return;
         
        if (filterByVSE) {
            //if (filterByWholesaler) toggleFilterByWholesaler(false);
            setCustomerList(customerList.filter((customer) => customer.customer_type === 'retailer-vse' ));
        }else{
            if (data) {
                setCustomerList(data.data?.map((item) => ({
                    ...item,
                    key: item.id
                })));
            }
        }

    },[filterByVSE]);

    useEffect(() => {
        if (!customerList) return;
         
        if (filterByWholesaler) {
            // /if (filterByVSE) toggleFilterByVSE(false)
            
            setCustomerList(customerList.filter((customer) => customer.customer_type === 'wholesaler' ));
        }else{
            if (data) {
                setCustomerList(data.data?.map((item) => ({
                    ...item,
                    key: item.id
                })));
            }
        }
    },[filterByWholesaler]);

    useEffect(() => {
        if (customerTobeEdited) {
            form.setFieldValue("customer_name", customerTobeEdited.name);
            form.setFieldValue("phone_number", customerTobeEdited.phone);
            form.setFieldValue("customer_type", customerTobeEdited.customer_type);
        }

    },[customerTobeEdited]);


    const handleFilterByVSE = () => {
        toggleFilterByVSE((prev) => !prev);
    }
    const handleFilterByWholesalers = () => {
        toggleFilterByWholesaler((prev) => !prev);
    }
    
    const onSearch = (value: string) => {
        
        setCustomerList((prev) => prev?.filter(customer => customer.name.indexOf(value) === -1));
        if (value.length === 0) {
            if (data) {
                setCustomerList(data.data?.map((item) => ({
                    ...item,
                    key: item.id
                })));
            }
        }else {
            if (data) {
                setCustomerList(customerList?.filter((customer) => customer.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ));
            }
        }
    }

    const { mutate } = useMutation({
        mutationFn: (values: any) => removeCustomer(values, useAuthToken() || ""),
                onSuccess: (data) => {
                    success(data?.data || "")
                    // setCustomerList((prev) => prev?.filter(customer => customer.id !== values))
                    queryClient.invalidateQueries();
                },
                onError: (error: AppError) => {
                    messageApi.open({
                        type: 'error',
                        content: error.message + ". Please Check your internet connection and refresh the page."
                    });
                    setTimeout(messageApi.destroy, 2500);
                }
    })

    const success = (msg:string) => {
        messageApi.open({
          type: 'success',
          content: msg,
        });
        setTimeout(messageApi.destroy, 2500);
    }

    const remove = (id: number) => {
        mutate(id);
        // if (!customerList) return;
        // setCustomerList(customerList.filter((customer) => customer.id !== id));
    }


    const columms = [
        { title: 'Name', dataIndex: 'name', key: 'name', render: (_: any, customer: ICustomer) => <Link to={`${customer.id}/history`}>{customer.name}</Link> },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Type', dataIndex: 'customer_type', key: 'customer_type', render: (value: string) => value.toUpperCase() },
        {
            title: 'Empties Balance',
            dataIndex: 'customer_empties_account',
            key: 'customer_empties_account',
            render: (value: ICustomerReturnEmpties[]) => 
                (
                    value.reduce(
                        (acc: number, item: ICustomerReturnEmpties) => {
                            if (item.transaction_type === 'in') {
                                return acc + item.quantity_transacted;
                            }else {
                                return acc - item.quantity_transacted;
                            }
                        }, 0
                    )
                )
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action', 
            render: (_: any, customer: ICustomer) => (
                <Space direction="horizontal">
                    <Tooltip title="Edit">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => {
                            setCustomerTobeEdited(customer);
                            //customer_name

                            setIsModalOpen(true);
                            
                            
                        }}/>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button shape="circle" icon={<DeleteOutlined />} danger onClick={() => {
                            Modal.confirm({
                                title: 'Confirm Logout',
                                content: `Are you sure you want to delete ${customer.name}?`,
                                okText: 'Delete',
                                cancelText: 'Cancel',
                                onOk() {
                                    if (customer.id !== undefined) {
                                        remove(customer.id);
                                    }
                                },
                                onCancel() {
                                    console.log('Cancel');
                                },
                                });
                        }}/>
                    </Tooltip>
                    {
                        customer.customer_type.toLowerCase() === WHOLESALER &&
                        <Tooltip title="Attach MOU">
                            <Button>Attach MOU</Button>
                        </Tooltip>
                    }
                </Space>
            )
        }
    ];

const dropDownItems: MenuProps['items'] = [
        {
            key: '1',
            label: "wholesaler",
            onClick: () => {
                form.setFieldValue("customer_type", "wholesaler")
                if (customerTobeEdited) {
                    setCustomerType("wholesaler");
                }
            }
        },
        {
            key: '2',
            label: "retailer",
            onClick: () => {
                form.setFieldValue("customer_type", "retailer")
                if (customerTobeEdited) {
                    setCustomerType("retailer");
                }
            }
        },
        { 
            key: '3',
            label: "retailer-vse",
            onClick: () => {
                form.setFieldValue("customer_type", "retailer-vse")
                if (customerTobeEdited) {
                    setCustomerType("retailer-vse");
                }
            }

            
        }
    ];

    return (
        <>
        {contextHolder}
            <Space direction={"horizontal"} style={{marginBottom: "2rem"}}>
                <Search
                    placeholder="Search for customer"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                />
                <Button type={filterByVSE ? "primary" : "default"} onClick={() => handleFilterByVSE()} disabled={filterByWholesaler} size={'large'}>Filter By VSE</Button>
                <Button type={filterByWholesaler ? "primary" : "default"} onClick={() => handleFilterByWholesalers()} disabled={filterByVSE} size={'large'}>Filter By Wholesalers</Button>
            </Space>
            <TableCustomers 
                columns={columms}
                data={customerList}
                isLoading={isLoading}
            />
            <Modal
                title="Edit Customer"
                closable={true}
                open={isModalOpen}
                // onOk={}
                onCancel={setIsModalOpen.bind(this, false)}
            >
                <Form layout={'horizontal'}
                    form={form}
                    initialValues={{
                        customer_name: customerTobeEdited?.name,
                        phone_number: customerTobeEdited?.phone,
                        customer_type: customerTobeEdited?.customer_type
                    }}
                >
                    <Form.Item label="Customer Name" name={"customer_name"}>
                        <Input placeholder="Customer Name" />
                    </Form.Item>
                    <Form.Item label="Phone Number" name={"phone_number"}>
                        <Input placeholder="Phone Number" />
                    </Form.Item>
                    <Form.Item label="Customer Type" name={"customer_type"}>
                        <Dropdown menu={{ items: dropDownItems, selectable: true }} >
                            
                            <Space>
                                {customerType === "" ? customerTobeEdited?.customer_type : customerType}
                                <DownOutlined />
                            </Space>
                            
                        </Dropdown>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ListCustomers;