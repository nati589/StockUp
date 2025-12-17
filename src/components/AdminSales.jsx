import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { Divider } from "@mui/material";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
// import { db } from "../config/firebase";
// import { getDocs, collection } from "firebase/firestore";
import api from "../lib/api";

const StyledMUIDataTable = styled(MUIDataTable)(({ theme }) => ({
  background: theme.palette.background.default,
}));
const columns = [
  "Salesperson",
  {
    name: "PRODUCTS",
    options: {
      filter: false,
    },
  },
  {
    name: "DATE SOLD",
    options: {
      filter: false,
    },
  },
  {
    name: "TOTAL",
    options: {
      filter: false,
    },
  },
  {
    name: "ID",
    options: {
      filter: false,
      display: false,
      sort: false,
      search: false,
    },
  },
];

function AdminSales() {
  const salesRef = api.get("/sales");
  const [salesList, setSalesList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const productRef = api.get("/products");
  const [productList, setProductList] = useState([]);
  const [filter, setFilter] = useState("Today");

  const options = {
    elevation: 0,
    responsive: "standard",
    selectableRows: "none",
    expandableRows: true,
    expandableRowsHeader: false,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData, rowMeta) => {
      const colSpan = rowData.length + 1;
      const data = salesList.find((sale) => sale.id === rowData[4])?.items;
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
                      <TableCell align="right">{item.price * item.quantity}</TableCell>
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
  const handleSubTotalSum = (data) => {
    let sum = 0;
    for (let val = 0; val < data.length; val++) {
      sum += data[val][3];
    }
    return sum;
  };

  const getDetails = async () => {
    try {
      const salesData = await salesRef;
      const filteredSales = salesData.data.map((sale) => ({
        ...sale,
        id: sale._id,
      }));
      setSalesList(
        filteredSales.filter(
          (sale) =>
            sale.credit === false || sale?.creditinfo?.payment_covered === true
        )
      );
      setTableData(
        filteredSales
          .filter(
            (sale) =>
              sale.credit === false ||
              sale?.creditinfo?.payment_covered === true
          )
          .map((sale) => {
            return [
              sale.seller,
              sale.items.length,
              sale.date_sold,
              sale.total,
              sale.id,
            ];
          })
          .filter((sale) => {
            let now = new Date();
            let [month, day, year] = sale[2].split("/");
            return (
              now.getFullYear() == year &&
              now.getMonth() + 1 == month &&
              now.getDate() == day
            );
          })
      );
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
  const handleSort = (event) => {
    setTableData(
      salesList
        .map((sale) => {
          return [sale.seller, sale.items.length, sale.date_sold, sale.total, sale.id];
        })
        .filter((sale) => {
          let now = new Date();
          let [month, day, year] = sale[2].split("/");
          console.log(now.getFullYear() == year);
          if (event.target.value === "Today") {
            return (
              now.getFullYear() == year &&
              now.getMonth() + 1 == month &&
              now.getDate() == day
            );
          } else if (event.target.value === "This Month") {
            return now.getFullYear() == year && now.getMonth() + 1 == month;
          } else if (event.target.value === "This Year") {
            return now.getFullYear() == year;
          } else {
            return true;
          }
        })
    );
  };
  useEffect(() => {
    getDetails();
  }, []);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          ml: 1,
          mr: 1,
          mb: 2,
        }}>
        <Typography variant="h4">Sales Report</Typography>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel id="categories">Filter</InputLabel>
          <Select
            labelId="categories"
            id="categoryid"
            value={filter}
            label="Categories"
            onChange={(event) => {
              setFilter(event.target.value);
              handleSort(event);
            }}>
            {["Today", "This Month", "This Year", "All"].map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={1} sx={{ pl: 1, pr: 1 }}>
        <Grid
          item
          xs={8}
          md={8}
          sx={{
            pr: 1,
          }}>
          <StyledMUIDataTable
            title={"Sales"}
            data={tableData}
            columns={columns}
            options={options}
          />
        </Grid>
        <Grid item xs={4} md={4} sx={{ maxHeight: "80vh" }}>
          <Card sx={{ mt: 5 }}>
            <Typography variant="h6" sx={{ ml: 2, mb: 2 }}>
              Sales Summary
            </Typography>
            <Divider />
            <CardContent sx={{ pl: 3, pr: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}></Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}>
                <Typography>Sub-total</Typography>
                <Typography>
                  {handleSubTotalSum(tableData).toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}>
                <Typography>TXBL</Typography>
                <Typography>
                  {handleSubTotalSum(tableData).toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}>
                <Typography>TAX</Typography>
                <Typography>
                  {(handleSubTotalSum(tableData) * 0.15).toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="primary">Total</Typography>
                <Typography color="primary">
                  {(handleSubTotalSum(tableData) * 1.15).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default AdminSales;
