import * as React from "react";
import { useAuthHeader } from "react-auth-kit";
import { useQuery } from '@tanstack/react-query';
import { IEmptiesInHouseCount } from "../../interfaces/Empties";
import { ServerResponse } from "../../interfaces/Server";
import { getInHouseEmpties } from "../../services/EmptiesAPI";
import type { ColumnsType } from 'antd/es/table';
import TableEmptiesOnGround from "../../components/TableEmptiesOnGround";
import { Table, DatePicker, Row, Col, Statistic, Card, Tag } from 'antd';

const ListInHouseEmpties = () => {
    const { RangePicker } = DatePicker;
    const authHeader = useAuthHeader();
    const [inHouseEmptiesData, setInHouseEmptiesData] = React.useState<IEmptiesInHouseCount[] | undefined>(undefined);

    const { data: inHouseEmpties, isLoading } = useQuery<ServerResponse<IEmptiesInHouseCount[]>, Error>({
        queryKey: ['in-house-empties'],
        queryFn: () => getInHouseEmpties(authHeader()),
    });

    const [dateRange, setDateRange] = React.useState<string[] | undefined>(undefined);

    React.useEffect(() => {
        if (inHouseEmpties) {
            setInHouseEmptiesData(inHouseEmpties.data?.map((item) => ({
                ...item,
                key: item.id
            })))
        }
    }, [inHouseEmpties]);

    const dateRangeOnChange = (date: any, dateString: string[]) => {
        console.log(date, dateString);
        setDateRange(dateString);
    }

    const columns: ColumnsType<IEmptiesInHouseCount> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        Table.EXPAND_COLUMN,
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Number of PCs',
            dataIndex: 'number_of_pcs',
            key: 'number_of_pcs',
        }
    ]



    return (
        <>
        Select a date Range <RangePicker onChange={dateRangeOnChange}/>
            <Row gutter={16}>
                <Col span={12}>
                    <Card bordered={true}>
                        <Statistic
                            title="Total Empties On Ground"
                            value={inHouseEmptiesData?.reduce((acc: number, item: IEmptiesInHouseCount) => acc + item.quantity, 0)}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={true}>
                        <Statistic
                            title="Total Fulls On Ground"
                            value={inHouseEmptiesData?.reduce((acc: number, item: IEmptiesInHouseCount) => acc + ((item.products !== undefined) ? item.products.filter(p => !p.is_empty).length : 0), 0)}
                            // valueStyle={{ color: emptiesBalance < 0?'#ff0000':'#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>
            </Row>
            <TableEmptiesOnGround 
                isDataLoading={isLoading}
                columns={columns}
                data={inHouseEmptiesData}
            />
        </>
    )
}

export default ListInHouseEmpties;