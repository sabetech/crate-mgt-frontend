import { Table } from "antd";

type TableReceivableLogProps = {
    columns: any;
    data: any;
}

const TableReceivableLog: React.FC<TableReceivableLogProps> = ({columns, data}) => {
    return (<>
        <Table 
            columns={columns}
            dataSource={data}
        />
    </>)
}

export default TableReceivableLog;