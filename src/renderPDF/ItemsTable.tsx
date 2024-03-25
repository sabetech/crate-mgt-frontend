import { View, StyleSheet, Text } from "@react-pdf/renderer";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import TableFooter from "./TableFooter";
import { TSaleReport } from "../types/TSaleReport";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: '10%',
    marginVertical: '10%',
    justifyContent: 'center'
  },
});

type SalesReportTableProps = {
    data: TSaleReport[],
    dateRange: string[]
}

const ItemsTable = ({ data, dateRange }: SalesReportTableProps ) => (
  <View style={styles.tableContainer}>
    <View style={{ backgroundColor: 'grey', width: '100%', textAlign: 'center' }}>
        <Text style={{ fontWeight: 'bold' }}>{`Details of Godds Sold: ${dateRange[0]}  -  ${dateRange[1]}`}</Text>
    </View>
    <TableHeader />
    <TableRow items={data} />
    {<TableFooter items={data} />}
  </View>
);

export default ItemsTable;