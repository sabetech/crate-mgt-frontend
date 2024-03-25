import { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { TSaleReport } from "../types/TSaleReport";
import * as utils from "../utils/helpers"

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: '1rem',
    border: "1px solid #000000",
  },
  date: {
    width: "20%",
  },
  product: {
    width: "25%",
  },
  quantity_sold: {
    width: "15%",
    marginHorizontal: "8%"
  },
  unit_price: {
    width: "20%",
  },
  total_sales: {
    width: "20%",
  }
});

const TableRow = ({ items }: any) => {
  const rows = items.map((item: TSaleReport) => (
    <View style={styles.row} key={item.id}>
      <Text style={styles.date}>{ utils.formatDate(item.date ?? "")}</Text>
      <Text style={styles.product}>{item.sku_name}</Text>
      <Text style={styles.quantity_sold}>{item.Qty_Sold}</Text>
      <Text style={styles.unit_price}>{item.unit_price}</Text>
      <Text style={styles.total_sales}>{item.total_sales}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default TableRow;