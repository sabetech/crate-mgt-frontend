import { Space, Button, Typography } from "antd";
import { UndoOutlined, AppstoreAddOutlined } from "@ant-design/icons";

const Receivables = () => {
    return (
        <>
            <h1>
                Receivables
            </h1>
            <Space direction={'vertical'} size={'large'} style={{ display: 'flex' }}>
                <Space direction={'horizontal'} size={"large"}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Button size={'large'} shape="circle" icon={<UndoOutlined />} />
                        <Typography.Text>VSE Returns</Typography.Text>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Button size={'large'} shape="circle" icon={<AppstoreAddOutlined />} />
                        <Typography.Text>GGBL</Typography.Text>
                    </div>

                </Space>
            </Space>
        </>
    )
}

export default Receivables;