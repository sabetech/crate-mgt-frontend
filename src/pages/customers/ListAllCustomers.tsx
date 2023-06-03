import TableCustomers from "../../components/TableCustomers";

const ListCustomers: React.FC = () => {

    const columms = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Type', dataIndex: 'Type', key: 'Type' },
        { title: 'Empties Balance', dataIndex: 'empties_balance', key: 'empties_balance' },
    ];

    return (
        <TableCustomers 
            columns={columms}
            data={[]}
        />
    );
}

export default ListCustomers;