import styled from "@emotion/styled";
import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import MUIDataTable from "mui-datatables";
// import { db } from "../config/firebase";
// import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import api from "../lib/api";

function Credit() {
  const [open, setOpen] = useState(false);
  const [paid, setPaid] = useState(0);
  const [modalData, setModalData] = useState();
  const [credit, setCredit] = useState([]);
  const [creditList, setCreditList] = useState([]);
  const [productList, setProductList] = useState([]);
  // const creditRef = collection(db, "sales");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // console.log(creditList)
  const handleClose = async (data, unpaid, covered, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      if (covered || unpaid === 0) {
        console.log(unpaid);
        try {
          // const creditDoc = doc(db, "sales", data.id);
          await api.put(`/sales/${data.id}`, {
            creditinfo: {
              payment_covered: true,
              unpaid: unpaid,
              name: data.creditorName,
              duedate: data.dueDate,
            },
          }).then(() => setOpenSnackbar(true));
          getDetails();
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          // const creditDoc = doc(db, "sales", data.id);
          await api.put(`/sales/${data.id}`, {
            creditinfo: {
              payment_covered: false,
              unpaid: unpaid,
              name: data.creditorName,
              duedate: data.dueDate,
            },
          }).then(() => setOpenSnackbar(true));
          getDetails();
        } catch (error) {
          console.error(error);
        }
      }
      setPaid(0);
      setModalData();
      setOpen(false);
    }
  };
  const handleBackdropClick = (event) => {
    //these fail to keep the modal open
    event.stopPropagation();
    return false;
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const StyledMUIDataTable = styled(MUIDataTable)(({ theme }) => ({
    background: theme.palette.background.default,
  }));
  const columns = [
    "Name",
    {
      name: "Amount",
      options: {
        filter: false,
      },
    },
    {
      name: "Unpaid",
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
    "Status",
    {
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, rowData, tableMeta, updateValue) => {
          let data = rowData.rowData;
          return (
            <Button
              variant="outlined"
              onClick={() => {
                setModalData({
                  id: data[4],
                  creditorName: data[0],
                  amount: data[1],
                  dueDate: data[3],
                  unpaid: data[2],
                  paymentcovered: false,
                });
                setOpen(true);
              }}
              disabled={value === "Paid"}>
              Update
            </Button>
          );
        },
      },
      name: "update",
    },
  ];
  const options = {
    filterType: "dropdown",
    selectableRows: "none",
    responsive: "standard",
    elevation: 0,
    expandableRows: true,
    expandableRowsHeader: false,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData, rowMeta) => {
      const colSpan = rowData.length + 1;
      const data = credit.find((credit) => credit.id === rowData[4])?.items;
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
      setCredit(
        filteredCredits.filter(
          (credit) => credit?.creditinfo?.payment_covered === false
        )
      );
      setCreditList(
        filteredCredits
          .filter(
            (filteredCredit) =>
              filteredCredit?.creditinfo?.payment_covered === false
          )
          .map((filteredCredit) => {
            let [month, day, year] = filteredCredit.date_sold.split("/");
            return [
              filteredCredit.creditinfo.name,
              filteredCredit.total,
              filteredCredit.creditinfo.unpaid,
              filteredCredit.creditinfo.duedate,
              filteredCredit.id,
              day,
              month,
              year,
              filteredCredit.creditinfo?.payment_covered === true
                ? "Paid"
                : "Unpaid",
              filteredCredit.creditinfo?.payment_covered === true
                ? "Paid"
                : "Unpaid",
            ];
            // return {
            //   id: filteredCredit.id,
            //   creditorName: filteredCredit.creditinfo.name,
            //   amount: filteredCredit.total,
            //   dueDate: filteredCredit.creditinfo.duedate,
            //   unpaid: filteredCredit.creditinfo.unpaid,
            //   paymentcovered: filteredCredit.creditinfo.payment_covered,
            //   products: filteredCredit.items,
            // };
          })
      );
      // console.log(typeof filteredCredits[0]?.creditinfo?.payment_covered);
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
    <Box sx={{ maxHeight: "80vh", overflowY: "scroll", pl: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mb: 2, pb: 2 }}>
            Credit List
          </Typography>
          <StyledMUIDataTable
            title={"Credits"}
            data={creditList}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          onBackdropClick={handleBackdropClick}
          disableEscapeKeyDown
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Credit Information
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Name: {modalData?.creditorName}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Due Date: {modalData?.dueDate}
            </Typography>
            <TextField
              margin="normal"
              required
              error={paid > modalData?.unpaid || isNaN(paid)}
              fullWidth
              id="paid"
              label="Amount Paid"
              name="paid"
              onChange={(event) => {
                setPaid(event.target.value);
              }}
              autoFocus
            />
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Amount Left: {modalData?.unpaid - paid}
            </Typography>
            <Button
              onClick={() =>
                handleClose(modalData, modalData?.unpaid - paid, false)
              }
              variant="outlined"
              disabled={paid > modalData?.unpaid || isNaN(paid)}
              sx={{ mr: 2, mt: 2 }}>
              Update
            </Button>
            <Button
              onClick={() => {
                handleClose(modalData, 0, true);
              }}
              variant="outlined"
              disabled={paid > modalData?.unpaid || isNaN(paid)}
              sx={{ mr: 2, mt: 2 }}>
              Payment Covered
            </Button>
          </Box>
        </Modal>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}>
        <Alert
          severity="success"
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}>
          Updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Credit;
