import { Table } from "antd";

type TableReceivableLogProps = {
    columns: any;
    data: any;
}

const TableReceivableLog: React.FC<TableReceivableLogProps> = ({columns, data}) => {

    console.log("TABLE DATAA::", data)

    return (<>
        <Table 
            columns={columns}
            dataSource={data.data}
        />
    </>)
}

export default TableReceivableLog;