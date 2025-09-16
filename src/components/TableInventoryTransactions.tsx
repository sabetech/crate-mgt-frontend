import { Table } from "antd";

type TableReceivableLogProps = {
    columns: any;
    data: any;
}

const TableInventoryTransaction: React.FC<TableReceivableLogProps> = ({columns, data}) => {

    console.log("TABLE Inventory Logs::", data)

    return (<>
        <Table 
            columns={columns}
            dataSource={data}
        />
    </>)
}

export default TableInventoryTransaction;