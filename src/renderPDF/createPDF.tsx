import { PDFViewer } from '@react-pdf/renderer'
import Table from './Table';


const MyDocument = ({ dateRange, report }: any) => {
  
  return (
  <PDFViewer>
      {
        report &&
        <Table data={report} dateRange={dateRange}/> 
      }
  </PDFViewer>
)};
// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "white",
//     padding: 5,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   section: {
//     margin: 1,
//     padding: 1,
//     flexGrow: 1,
//   },
//   text: {
//     fontSize: 12,
//   },
// });

export default MyDocument;