import * as React from "react";
import { useAuthToken } from "../../hooks/auth";
import { useQuery } from '@tanstack/react-query';
import { IEmptiesInHouseCount } from "../../interfaces/Empties";
import { ServerResponse } from "../../interfaces/Server";
import { getInHouseEmpties } from "../../services/EmptiesAPI";
import type { ColumnsType } from 'antd/es/table';
import TableEmptiesOnGround from "../../components/TableEmptiesOnGround";
import { Table, Row, Col, Statistic, Card, Typography } from 'antd';
import { formatDate } from "../../utils/helpers";

const ListInHouseEmpties = () => {
    const authToken = useAuthToken();
    const [inHouseEmptiesData, setInHouseEmptiesData] = React.useState<IEmptiesInHouseCount[] | undefined>(undefined);

    console.log("EMPTIES IN HOSUE LOGS::", inHouseEmptiesData);

    const { data: inHouseEmpties, isLoading } = useQuery<ServerResponse<IEmptiesInHouseCount[]>, Error>({
        queryKey: ['in-house-empties'],
        queryFn: () => getInHouseEmpties(authToken),
    });

    React.useEffect(() => {
        if (inHouseEmpties) {
            setInHouseEmptiesData(inHouseEmpties.data?.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()).map((item) => ({
                ...item,
                key: item.id
            })))
        }
    }, [inHouseEmpties]);

    const columns: ColumnsType<IEmptiesInHouseCount> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (value: string) => formatDate(value)
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
        <Typography.Title level={2}>Empties On Ground</Typography.Title>
        
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
                            title="Total Empty Plastic Containers (EPCs)"
                            value={0}
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