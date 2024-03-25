import { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: '2rem',
        backgroundColor: '#D3D3D3'
    },
    date: {
      width: "20%",
      fontWeight: "heavy"
    },
    product: {
      width: "20%",
      fontWeight: "heavy"
    },
    quantity_sold: {
      width: "20%",
      fontWeight: "heavy"
    },
    unit_price: {
      width: "20%",
      fontWeight: "heavy"
    },
    total_sales: {
      width: "20%",
      fontWeight: "heavy"
    }
  });

const TableHeader = () => 
    <Fragment>
        <View style={styles.row}>
            <Text style={styles.date}>Date</Text>
            <Text style={styles.product}>SKU NAME</Text>
            <Text style={styles.quantity_sold}>Quantity Sold</Text>
            <Text style={styles.unit_price}>Unit Prices</Text>
            <Text style={styles.total_sales}>Total Sales</Text>
        </View>
    </Fragment>

export default TableHeader;