import { Alert, Button, Tabs, Typography } from 'antd';
import { DatePicker, Space, Form } from 'antd';
import type { TabsProps } from 'antd';
import type { DatePickerProps } from 'antd';
import AddProductQuantityFields from '../../components/AddProductQuantityFields';
const AdjustStock =  () => {
    const [form] = Form.useForm();

    const PromoStocks = () => <>
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
          > 
            <Form.Item
                label="Promo Stock Date"
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
              
              <Button type="primary">Submit</Button>
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
            >   
                <Form.Item
                    label="Promo Stock Date"
                    required
                >
                    <DatePicker size='large' onChange={onChange} style={{width: 300, marginBottom: 10}}/>
                </Form.Item>
                <Form.Item
                label="Promo Stock Product Quantities">
                    <AddProductQuantityFields 
                        name="selected_owed_products" 
                        is_returnable={false}
                    />
                </Form.Item>
                
                <Button type="primary">Submit</Button>
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