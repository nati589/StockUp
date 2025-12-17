import {
  Grid,
  Typography,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/system";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
// import { db } from "../config/firebase";
// import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import api from "../lib/api";

const StyledMUIDataTable = styled(MUIDataTable)(({ theme }) => ({
  background: theme.palette.background.default,
}));
const columns = [
  "Name",
  {
    name: "Date Sold",
    options: {
      filter: false,
    },
  },
  {
    name: "Due Date",
    options: {
      filter: false,
    },
  },
  {
    name: "Total",
    options: {
      filter: false,
    },
  },
  {
    name: "ID",
    options: {
      display: false,
      filter: false,
    },
  },
  {
    name: "DAY",
    options: {
      display: false,
      filter: true,
    },
  },
  {
    name: "MONTH",
    options: {
      display: false,
      filter: true,
    },
  },
  {
    name: "YEAR",
    options: {
      display: false,
      filter: true,
    },
  },
  "Salesperson",
  "Status",
];

function CreditReport() {
  // const creditRef = collection(db, "sales");
  const [credit, setCredit] = useState([]);
  const [creditList, setCreditList] = useState([]);
  const [productList, setProductList] = useState([]);

  const options = {
    // filterType: "checkbox",
    elevation: 0,
    selectableRows: "none",
    expandableRows: true,
    expandableRowsHeader: false,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData, rowMeta) => {
      const colSpan = rowData.length + 1;
      const data = creditList.find((credit) => credit.id === rowData[4])?.items;
      return (
        <TableRow>
          <TableCell colSpan={colSpan}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead sx={{ mb: 2 }}>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {
                          productList.find((product) => product.id === item.id)
                            ?.name
                        }
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.price}</TableCell>
                      <TableCell align="right">
                        {item.price * item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TableCell>
        </TableRow>
      );
    },
  };

  const getDetails = async () => {
    try {
      const creditData = await api.get("/sales");
      const filteredCredits = creditData.data.map((credit) => ({
        ...credit,
        id: credit._id,
      }));
      setCreditList(filteredCredits.filter((credit) => credit.credit === true));
      setCredit(
        filteredCredits
          .filter((credit) => credit.credit === true)
          .map((filteredCredit) => {
            let [month, day, year] = filteredCredit.date_sold.split("/");
            return [
              filteredCredit.creditinfo.name,
              filteredCredit.date_sold,
              filteredCredit.creditinfo.duedate,
              filteredCredit.total,
              filteredCredit.id,
              day,
              month,
              year,
              filteredCredit.seller,
              filteredCredit.creditinfo?.payment_covered === true
                ? "Paid"
                : "Unpaid",
            ];
          })
      );
      const productRef = api.get("/products");
      const productData = await productRef;
      const filteredProducts = productData.data.map((product) => ({
        ...product,
        id: product._id,
      }));
      setProductList(filteredProducts);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDetails();
  }, []);
  return (
    <Grid container spacing={1} sx={{ pl: 1, pr: 1 }}>
      <Grid
        item
        xs={12}
        md={12}
        sx={{
          pr: 1,
        }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Credit Report
        </Typography>
        <StyledMUIDataTable
          title={"Credits"}
          data={credit}
          columns={columns}
          options={options}
        />
        {/* <Products cardData={cardData} addToCart={addToCart} /> */}
      </Grid>
    </Grid>
  );
}

export default CreditReport;
