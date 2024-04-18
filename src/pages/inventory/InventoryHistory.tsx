import { useState } from "react";
import { Typography } from "antd";

const InventoryHistory = () => {
    const [inventoryHistory, setInventoryHistory] = useState([]);

    

    return (<>
        <Typography.Title level={3}>Inventory History</Typography.Title>
    </>)
}

export default InventoryHistory;