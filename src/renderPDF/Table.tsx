import { Page, Document, StyleSheet } from "@react-pdf/renderer";
import ItemsTable from "./ItemsTable";

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    flexDirection: "column",
  },
});

const Table = ({ data, dateRange }:any)=> (
  <Document>
    <Page size="A4" style={styles.page}>
      <ItemsTable data={data} dateRange={dateRange} />
    </Page>
  </Document>
);

export default Table;