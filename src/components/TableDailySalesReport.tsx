import { useQuery } from "@tanstack/react-query";
import { Table, Button } from "antd";
import { TSaleReport } from "../types/TSaleReport";
import { ServerResponse } from '../interfaces/Server';
import { getDailySalesReport } from '../services/SalesAPI';
import { useAuthHeader } from 'react-auth-kit'
import { useEffect } from "react";

type SalesReportProps = {
    customerOption: string,
    dateRange: Array<string>
}

const TableDailySalesReport = ({customerOption, dateRange}: SalesReportProps) => {

    const authHeader = useAuthHeader();

    const { data: salesReport } = useQuery<ServerResponse<TSaleReport[]>, Error>(
        ['sales_report', dateRange],
        () => {
            // if (dateRange[1] == '') return  Promise.resolve({data: []});
            return getDailySalesReport( authHeader(), dateRange, customerOption )
        });


    console.log("SALES REPORT", salesReport);

    useEffect(() => {
        if (dateRange.length < 1) return;
        if (dateRange[0] == '') return;

    }, [dateRange]);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Product',
            dataIndex: 'sku_name',
            key: 'sku_name'
        },
        {
            title: 'Quantity',
            dataIndex: 'Qty_Sold',
            key: 'Qty_Sold'
        },
        {
            title: 'Price',
            dataIndex: 'unit_price',
            key: 'unit_price'
        },
        {
            title: 'Total Sales',
            dataIndex: 'total_sales',
            key: 'total_sales'
        }
    ];

    const showPDF = () => {
        
    }

    return (
        <>
        <Button type="primary" size={'large'} style={{float: 'right'}} onClick={showPDF}>Print Report</Button>
            <Table 
                columns={columns} 
                dataSource={salesReport?.data} 
            />
        </>
    );
}

export default TableDailySalesReport;