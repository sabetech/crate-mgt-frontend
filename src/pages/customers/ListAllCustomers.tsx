import React, { useEffect, useState } from "react";
import { Button, Input, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TableCustomers from "../../components/TableCustomers";
import { useAuthToken } from "../../hooks/auth";
import { ICustomer, ICustomerReturnEmpties } from "../../interfaces/Customer";
import { ServerResponse } from "../../interfaces/Server";
import { getCustomersWithBalance } from "../../services/CustomersAPI";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { WHOLESALER } from "../../utils/constants";

const { Search } = Input;
const ListCustomers: React.FC = () => {
    const authToken = useAuthToken();
    const [filterByVSE, toggleFilterByVSE] = useState<boolean>(false);
    const [filterByWholesaler, toggleFilterByWholesaler] = useState<boolean>(false);
    const [customerList, setCustomerList] = React.useState<ICustomer[] | undefined>(undefined);

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
                        <Button shape="circle" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button shape="circle" icon={<DeleteOutlined />} danger/>
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

    return (
        <>
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
        </>
    );
}

export default ListCustomers;