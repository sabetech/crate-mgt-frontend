import React, { useEffect } from "react";
import TableCustomers from "../../components/TableCustomers";
import { useAuthHeader } from "react-auth-kit";
import { ICustomer, ICustomerReturnEmpties } from "../../interfaces/Customer";
import { ServerResponse } from "../../interfaces/Server";
import { getCustomersWithBalance } from "../../services/CustomersAPI";
import { useQuery } from "@tanstack/react-query";

const ListCustomers: React.FC = () => {
    const authHeader = useAuthHeader();
    
    const { data } = useQuery<ServerResponse<ICustomer[]>, Error>(
        {
            queryKey: ['customer_with_balance'],
            queryFn: () => getCustomersWithBalance(authHeader())
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
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Type', dataIndex: 'customer_type', key: 'customer_type' },
        {
            title: 'Empties Balance',
            dataIndex: 'customer_empties_account',
            key: 'customer_empties_account',
            render: (value: ICustomerReturnEmpties[]) => 
                (
                    value.reduce(
                        (acc: number, item: ICustomerReturnEmpties) => acc + item.quantity_transacted, 0
                    )
                )
            }
        ];

    return (
        <TableCustomers 
            columns={columms}
            data={customerList}
        />
    );
}

export default ListCustomers;