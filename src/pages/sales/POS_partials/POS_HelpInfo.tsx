import { Alert } from "antd"
const POS_HelpInfo = () => <Alert
message="Help"
description="On the POS page, you cam sell products here based on what the customer wants. 
            If it's a retailer, the customer will not be allowed to purchase 
            if they don't have enough empties. Search for the product you want to sell and the quantity. Hit save. 
            When you are done, click on Save and Print. If the receipt is not printing, contact support."
type="info"
showIcon
style={{marginBottom: 20}}
/>

export default POS_HelpInfo