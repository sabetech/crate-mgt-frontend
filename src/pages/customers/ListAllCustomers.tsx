import React, { useEffect } from "react";
import TableCustomers from "../../components/TableCustomers";
import { useAuthHeader } from "react-auth-kit";
import { ICustomer, ICustomerReturnEmpties } from "../../interfaces/Customer";
import { ServerResponse } from "../../interfaces/Server";
import { getCustomersWithBalance } from "../../services/CustomersAPI";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const ListCustomers: React.FC = () => {
    const authHeader = useAuthHeader();
    
    const { data, isLoading } = useQuery<ServerResponse<ICustomer[]>, Error>(
        {
            queryKey: ['customer_with_balance'],
            queryFn: () => getCustomersWithBalance(authHeader()),
            onError: (error: Error) => {
                console.log(error);
            }
        }
    )
     
    const [customerList, setCustomerList] = React.useState<ICustomer[] | undefined>(undefined);

    useEffect(() => {
        if (data) {
            setCustomerList(data.data?.map((item) => ({
                ...item,
                key: item.id
            })
            ));
        }
    },[data]);


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
                                return acc - item.quantity_transacted;
                            }else {
                                return acc + item.quantity_transacted;
                            }
                        }, 0
                    )
                )
            }
        ];

    return (
        <TableCustomers 
            columns={columms}
            data={customerList}
            isLoading={isLoading}
        />
    );
}

export default ListCustomers;