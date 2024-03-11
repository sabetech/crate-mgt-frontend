import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
const MyDocument = () => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.text}>Hello, World!</Text>
      </View>
    </Page>
  </Document>
);
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    fontSize: 20,
  },
});

export default MyDocument;