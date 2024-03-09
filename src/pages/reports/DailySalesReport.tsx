import { useState } from "react";
import { DatePicker, Typography, Select, Space } from "antd";
import TableDailySalesReport from '../../components/TableDailySalesReport'


const { RangePicker } = DatePicker;

const DailySalesReport = () => {

    const [customerOption, setCustomerOption] = useState<string>("retailer");
    const [dateRange, setDateRange] = useState<string[]>([]);

    const handleChange = (value: string) => {
        console.log("SELECTED:",value)
        setCustomerOption(value)
    }

    const onDateChange = (dateString:  string[]) => {
        console.log( dateString);
        setDateRange(dateString)
      };

    return (
        <>
            <Typography.Title level={2}>Daily Sales Report</Typography.Title>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Typography>Select Date for Report</Typography>
                <RangePicker onChange={(_, dateString) => onDateChange(dateString)}  />
                
                <Select
                    defaultValue="retailer"
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                        { value: 'retailer', label: 'Retailers' },
                        { value: 'wholesaler', label: 'Wholesalers' },
                    ]}
                />

                <TableDailySalesReport customerOption={customerOption} dateRange={dateRange} />

            </Space>



        </>
    )
}

export default DailySalesReport;