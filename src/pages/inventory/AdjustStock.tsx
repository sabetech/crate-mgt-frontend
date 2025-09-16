import { Alert, Button, Tabs, Typography, message } from 'antd';
import { DatePicker, Space, Form } from 'antd';
import type { TabsProps } from 'antd';
import type { DatePickerProps } from 'antd';
import AddProductQuantityFields from '../../components/AddProductQuantityFields';
import { useMutation } from '@tanstack/react-query';
import { AppError } from '../../interfaces/Error';
import {submitPromostockAdjustment} from '../../services/InventoryAPI';
import { useAuthToken } from '../../hooks/auth';
import { IPromoStockRequest } from '../../interfaces/Inventory';

const AdjustStock =  () => {
    const [form] = Form.useForm();
    const token = useAuthToken();
    const [messageApi, contextHolder ] = message.useMessage();

    const { mutate, isLoading } = useMutation({
      mutationFn: (values: IPromoStockRequest) => submitPromostockAdjustment(token, values),
      onSuccess: (data: any) => {
        console.log(data)
        form.resetFields();
        
        messageApi.success("Promo Stock Adjusted Successfully", 2.5);

      },
      onError: (error: AppError) => {
        console.log(error)
      }
    })

    const submitPromoStock = ( _values: any ) => {
        console.log("Values:: Promo Stock:", _values);

        const promoStockRequest: IPromoStockRequest ={
            date: _values.date,
            product_quantities: _values.product_quantities,
            is_promo_stock: true
        }

        mutate(promoStockRequest);

    }

    const submitGGBLStockOwing = ( _values: any) => {
        console.log("Values:: GGBL Stock Owing:", _values);

        const promoStockRequest: IPromoStockRequest ={
            date: _values.date,
            product_quantities: _values.product_quantities,
            is_promo_stock: false
        }

        mutate(promoStockRequest);

    }


    const PromoStocks = () => <>
        {contextHolder}
      <Alert
        message="Help!"
        description="Input here the stock that is designated as promo stock so that is deducted from the current stock."
        type="info"
        showIcon
        closable
        />
      <Space direction='vertical' style={{marginTop: 30, width: '50hw'}}>
            
          <Form
              form={form}
              layout='vertical'
              onFinish={submitPromoStock}
          > 
            <Form.Item
                label="Promo Stock Date"
                name="date"
                required
            >
                <DatePicker size='large' onChange={onChange} style={{width: 300, marginBottom: 10}}/>
            </Form.Item>

            <Form.Item
                label="Promo Stock Product Quantities">
                <AddProductQuantityFields 
                    name="product_quantities" 
                    is_returnable={false}
                  />      
            </Form.Item>
              
              <Button type="primary" htmlType="submit">Submit</Button>
          </Form>
          
      </Space>
      </>

    const GGBLStockOwing = () => <>
        <Alert
            message="Info!"
            description="The stock listed here is what GGBL is restoring to OPK when they used their OPKs stock as promo"
            type="info"
            showIcon
            closable
        />
        <Space direction='vertical' style={{marginTop: 30, width: '50hw'}}>
            <Form
                form={form}
                layout='vertical'
                onFinish={submitGGBLStockOwing}
            >   
                <Form.Item
                    label="GGBL Stock Settlement Date"
                    name="date"
                    required
                >
                    <DatePicker size='large' onChange={onChange} style={{width: 300, marginBottom: 10}}/>
                </Form.Item>
                <Form.Item
                label="Promo Stock Product Quantities">
                    <AddProductQuantityFields 
                        name="product_quantities" 
                        is_returnable={false}
                    />
                </Form.Item>
                
                <Button type="primary" htmlType="submit" loading={isLoading}>Submit</Button>
            </Form>
        </Space>

    </>

    const items: TabsProps['items'] = [
        {
          key: '1',
          label: 'Promo Stocks From OPK',
          children: <PromoStocks />,
        },
        {
          key: '2',
          label: 'GGBL Promo Stock Reimbursement', 
          children: <GGBLStockOwing />,
        }, /**
            * On breakages: On POS: enter in a breakages like protocol
            * Like a customer called breakage.
            * 
        */
      ];

      const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
      };

    return (
        <>
            <Typography.Title level={2}>Promo Stocks</Typography.Title>
            <Tabs defaultActiveKey="1" items={items} style={{width: '50%'}}/>
        </>
    )
}

export default AdjustStock