import React, { useEffect } from 'react';
import TableEmptiesLog from '../../components/TableEmptiesLog';
import { ServerResponse } from '../../interfaces/Server';
import { IEmptyLog, IEmptyReturnedLog } from '../../interfaces/Empties';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmptiesLog, getEmptiesReturnedLog, toggleApprovePurchaseOrder, deletePurchaseOrder } from '../../services/EmptiesAPI';
import type { ColumnsType } from 'antd/es/table';
import { Table, Image, DatePicker, Spin, Row, Col, Statistic, Card, Tag, Button, message, Tooltip} from 'antd';
import { useAuthHeader } from 'react-auth-kit';
import { CheckOutlined, UndoOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const EmptiesLog: React.FC = () => {
    const authHeader = useAuthHeader();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient()

    //use react query to fetch data from server
    const { data: receivedEmpties } = useQuery<ServerResponse<IEmptyLog[]>, Error>({
        queryKey: ['empties_received'],
        queryFn: () => getEmptiesLog(authHeader()),
     }
    );

    const { data: returnedEmpties } = useQuery<ServerResponse<IEmptyReturnedLog[]>, Error>({
        queryKey: ['empties_returned'],
        queryFn: () => getEmptiesReturnedLog(authHeader()),
        
        }
    );

    const { mutate, isLoading: isSubmitting } = useMutation({
        mutationFn: (values: any) => toggleApprovePurchaseOrder(values.id, values.approved, authHeader()),
        onSuccess: () => {
            queryClient.invalidateQueries()
            success("Purchase Order Modified Successfully")
        }
    });

    const { mutate: deleteMutation } = useMutation({
        mutationFn: (values: any) => deletePurchaseOrder(values.id, authHeader()),
        onSuccess: () => {
            queryClient.invalidateQueries()
            success("Purchase Order Deleted Successfully")
        }
    });

    const success = (msg:string) => {
        messageApi.open({
          type: 'success',
          content: msg,
        });
        setTimeout(messageApi.destroy, 2500);
    }

    const [emptiesLog, setEmptiesLog] = React.useState<IEmptyLog[] | undefined>(undefined);
    const [emptiesReturnedLog, setEmptiesReturnedLog] = React.useState<IEmptyReturnedLog[] | undefined>(undefined);
    let emptiesBalance = (emptiesLog && emptiesReturnedLog) ? emptiesReturnedLog.reduce((acc: number, item: IEmptyReturnedLog) => acc + item.quantity, 0) - emptiesLog.reduce((acc: number, item: IEmptyLog) => acc + item.quantity_received, 0) : 0
    const [dateRange, setDateRange] = React.useState<string[] | undefined>(undefined);

    useEffect(() => {
        if (receivedEmpties) {
            setEmptiesLog(receivedEmpties.data?.map((item) => ({
                    ...item,
                    key: item.id})
                )
            );
        }
        if (returnedEmpties) {
            setEmptiesReturnedLog(returnedEmpties.data?.map((item) => ({
                ...item,
                key: item.id})
            ));
        }

    },[receivedEmpties, returnedEmpties]);

    useEffect(() => {

        if (dateRange) {
            console.log(dateRange);
            let [start, end] = dateRange;
            let filteredData = receivedEmpties?.data?.filter((item) => {
                let date = new Date(item.date);
                let startDate = new Date(start);
                let endDate = new Date(end);
                return date >= startDate && date <= endDate;
            });
            setEmptiesLog(filteredData?.map((item) => ({
                    ...item,
                    key: item.id})
                )
            );
        }
    }, [dateRange]);

    const onApproveHandle = (id: number, approved: boolean) => {
        mutate({id, approved});
    }

    const onUnapproveHandle = (id: number, approved: boolean) => {
        mutate({id, approved})
        console.log("Unapprove");
    }

    const dateRangeOnChange = (date: any, dateString: string[]) => {
        console.log(date, dateString);
        setDateRange(dateString);
    }

    const handleOndelete = (id: number) => {
        console.log(id);
        deleteMutation({id})
    }

    const columns: ColumnsType<IEmptyLog> = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        Table.EXPAND_COLUMN,
        { title: 'Quanity Received', dataIndex: 'quantity_received', key: 'quantity_received' },
        { title: 'Vehicle Number', dataIndex: 'vehicle_number', key: 'vehicle_number' },
        { title: 'Purchse Order Number', dataIndex: 'purchase_order_number', key: 'purchase_order_number' },
        { title: 'Received By', dataIndex: 'received_by', key: 'received_by' },
        { title: 'Delivered By', dataIndex: 'delivered_by', key: 'delivered_by' },
        { title: 'Image Reference', dataIndex: 'image_reference', key: 'image_reference', render: (value) => (<Image width={200} src={value} />) },
        {
          title: 'Action',
          dataIndex: 'approved',
          key: 'x',
          render: (value: number, record) => 
          <div style={{display: "flex" }}>
            {
            (value === 0 ? 
            <>
                <Tag color="error">Unapproved</Tag> 
                <Tooltip title="Approve">
                    <Button shape="circle" style={{marginRight: 7}}  icon={isSubmitting ? <Spin indicator={antIcon} /> : <CheckOutlined /> } onClick={() => onApproveHandle(record.id || 0, record.approved || false )}/>
                </Tooltip>
            </>
            : 
            <>
                <Tag color="success">Approved</Tag>
                <Tooltip title="Unapprove">
                    <Button shape="circle" style={{marginRight: 7}} icon={isSubmitting ? <Spin indicator={antIcon} /> : <UndoOutlined />} onClick={() => onUnapproveHandle(record.id || 0, record.approved || true)} />
                </Tooltip>
            </>
            )
            }
            <Tooltip title="Delete">
                <Button shape="circle" danger icon={<DeleteOutlined />} onClick={() => handleOndelete(record.id || 0)} />
            </Tooltip>
          </div>,
        },
      ];

    return (
        <>
        {contextHolder}
            Select a date Range <RangePicker onChange={dateRangeOnChange}/>
            <Row gutter={16}>
                <Col span={12}>
                    <Card bordered={true}>
                        <Statistic
                            title="Quantity Received"
                            value={emptiesLog ? emptiesLog.reduce((acc: number, item: IEmptyLog) => acc + item.quantity_received, 0) : 0}
                            valueStyle={{ color: '#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={true}>
                        <Statistic
                            title="Quantity Balance"
                            value={emptiesBalance}
                            valueStyle={{ color: emptiesBalance < 0?'#ff0000':'#3f8600' }}
                            suffix="empties"
                        />
                    </Card>
                </Col>
            </Row>
            <TableEmptiesLog columns={columns} data={emptiesLog} />
        </>
    ); 
}

export default EmptiesLog;