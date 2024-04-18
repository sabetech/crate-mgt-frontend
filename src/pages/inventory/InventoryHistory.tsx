import { useState } from "react";
import { DatePicker, Typography } from "antd";
import dayjs from 'dayjs';

const InventoryHistory = () => {
    const [inventoryHistory, setInventoryHistory] = useState([]);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))



    return (<>
        <Typography.Title level={3}>Inventory History</Typography.Title>
        <DatePicker 
            value={dayjs(date)}
            onChange={(date) => setDate(date.format('YYYY-MM-DD'))}
        />
    </>)
}

export default InventoryHistory;