import { Tabs } from 'antd';
import { Space, Button, Typography } from "antd";
import { UndoOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import AddInventoryReceivableFromGGBL from "../../components/AddInventoryReceivableFromGGBL";

const Receivables = () => {

    const receivableTabs = [
        {
            title: 'From GGBL',
            key: 'ggbl',
            icon: <AppstoreAddOutlined />,
            content: <AddInventoryReceivableFromGGBL />,
        },
        {
            title: 'Returns from VSEs',
            key: 'vse_returns',
            icon: <UndoOutlined />,
            content: 'Return from VSEs',
        }
    ]

    return (
        <>
            <h1>
                Receivables
            </h1>
            <Tabs
                defaultActiveKey="2"
                items={receivableTabs.map((item, i) => {
                const id = String(i)

                return {
                    label: (
                    <span>
                        { (item.icon) }
                        {item.title}
                    </span>
                    ),
                    key: id,
                    children: (item.content)
                };
                })}
            />
        </>
    )
}

export default Receivables;