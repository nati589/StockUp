import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  NativeSelect,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { db } from "../config/firebase";
// import { getDocs, collection, addDoc, updateDoc, doc, writeBatch } from "firebase/firestore";
import api from "../lib/api";

function SaleDetails({
  cart,
  removeCart,
  handleSnackbarOpen,
  removeCartItem,
  refreshProducts,
}) {
  const [subtotal, setSubtotal] = useState([]);
  const [subtotalvalue, setSubtotalvalue] = useState(0);
  const [credit, setCredit] = useState(false);
  const seller = localStorage.getItem("fullName");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSubtotalvalue(
      subtotal.reduce((total, sum) => {
        return total + sum.quantity * sum.price;
      }, 0)
    );
  }, [subtotal]);
  const formik = useFormik({
    initialValues: {
      seller: seller,
      creditorName: "",
      creditDueDate: "",
    },
    validationSchema: Yup.object({
      seller: Yup.string().required("Select a salesperson"),
      creditorName: Yup.string().required("Required field"),
      creditDueDate: Yup.date()
        .required("Required field")
        .min(new Date(), "Invalid date"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(subtotal);
      const submitSale = async () => {
        const date = new Date();
        const myDate = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;
        const [y, m, d] = values.creditDueDate.split("-");
        await api.post("/sales", {
          credit: true,
          items: subtotal.filter((i) => i.quantity && i.price),
          total: subtotalvalue,
          seller: values.seller,
          creditinfo: {
            name: values.creditorName,
            duedate: `${m}/${d}/${y}`,
            unpaid: subtotalvalue,
            payment_covered: false,
          },
          date_sold: myDate,
        });
        handleSnackbarOpen(true);
        refreshProducts();
      };
      submitSale();
      removeCart();
      setSubtotal([]);
      setSubtotalvalue(0);
      setCredit(false);
      resetForm({ values: "" });
    },
  });
  const formik2 = useFormik({
    initialValues: {
      seller: seller,
      buyer: "",
    },
    validationSchema: Yup.object({
      seller: Yup.string().required("Select a salesperson"),
      buyer: Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(subtotal);
      const submitSale = async () => {
        const date = new Date();
        const myDate = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;
        await api.post("/sales", {
          credit: false,
          items: subtotal.filter((i) => i.quantity && i.price),
          total: subtotalvalue,
          seller: values.seller,
          buyer: values.buyer,
          date_sold: myDate,
        });
        handleSnackbarOpen(true);
        refreshProducts();
      };
      submitSale();
      removeCart();
      setSubtotal([]);
      setSubtotalvalue(0);
      setCredit(false);
      resetForm({ values: "" });
    },
  });

  const handleSubtotal = (id, output, add) => {
    if (add) {
      let x = [...subtotal];
      x[x.length] = output;
      setSubtotal(x);
      let sum = 0;
      for (let i = 0; i < x.length; i++) {
        sum += x[i].price * x[i].quantity;
      }
      setSubtotalvalue(sum);
    } else {
      let x = [...subtotal];
      let index = x.indexOf(
        subtotal.filter((item) => {
          return item.id === id;
        })[0]
      );
      x[index] = { ...x[index], ...output };
      setSubtotal(x);
    }
  };

  const removeItem = (id) => {
    // console.log(subtotal);
    removeCartItem(id);
    setSubtotal((prev) => {
      return prev.filter((item) => item.id != id);
    });
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
    width: 600,
    height: 500,
    overflowY: "scroll",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, borderWidth: 1 }}>
      <Typography variant="h6" sx={{ ml: 2 }}>
        Sale Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box
        component="form"
        onSubmit={credit ? formik.handleSubmit : formik2.handleSubmit}
        noValidate
      >
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel id="sellerid">Salesperson Name</InputLabel>
          <Select
            labelId="sellerid"
            id="seller"
            name="seller"
            value={credit ? formik.values.seller : formik2.values.seller}
            label="Salesperson Name"
            onChange={credit ? formik.handleChange : formik2.handleChange}
            error={
              credit
                ? Boolean(formik.errors.seller) && formik.touched.seller
                : Boolean(formik2.errors.seller) && formik2.touched.seller
            }
            sx={{ height: 1 }}
          >
            <MenuItem value={formik.values.seller}>
              {formik.values.seller}
            </MenuItem>
          </Select>
        </FormControl>
        <Divider />
        <CardContent>
          <Grid container sx={{ mb: 2 }}>
            <Grid item md={3}>
              Item
            </Grid>
            <Grid item md={3}>
              <Typography>Quantity</Typography>
            </Grid>
            <Grid item md={3}>
              Unit Price
            </Grid>
            <Grid item md={3}>
              Item Total
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ maxHeight: 150, overflowY: "scroll", mb: 1 }}>
            {cart.map((item, index) => (
              <Box key={index}>
                <CartItem
                  cardData={{
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    // newQuantity: subtotal[index]?.quantity,
                    // newPrice: subtotal[index]?.price
                  }}
                  subtotal={subtotal}
                  handleSubtotal={handleSubtotal}
                  removeItem={removeItem}
                />
              </Box>
            ))}
          </Box>
          <FormControl>
            <FormLabel id="payment">Payment Method:</FormLabel>
            <RadioGroup
              aria-labelledby="payment"
              defaultValue="cash"
              name="radio-buttons-group"
            >
              <Box sx={{ display: "flex" }}>
                <FormControlLabel
                  value="cash"
                  control={
                    <Radio onClick={() => setCredit(false)} checked={!credit} />
                  }
                  label="Cash"
                />
                <FormControlLabel
                  value="credit"
                  control={
                    <Radio onClick={() => setCredit(true)} checked={credit} />
                  }
                  label="Credit"
                  // onClick={handleClose}
                />
              </Box>
            </RadioGroup>
          </FormControl>
          <Divider />
          {credit && (
            <Box>
              <TextField
                margin="normal"
                required
                fullWidth
                value={formik.values.creditorName}
                onChange={formik.handleChange}
                error={
                  Boolean(formik.errors.creditorName) &&
                  formik.touched.creditorName
                }
                helperText={
                  formik.touched.creditorName && formik.errors.creditorName
                }
                size="small"
                id="creditorName"
                label="Creditor Name"
                name="creditorName"
                // autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={formik.values.creditDueDate}
                onChange={formik.handleChange}
                error={
                  Boolean(formik.errors.creditDueDate) &&
                  formik.touched.creditDueDate
                }
                helperText={
                  formik.touched.creditDueDate && formik.errors.creditDueDate
                }
                size="small"
                id="creditDueDate"
                label="Due Date"
                name="creditDueDate"
                type="date"
                focused
              />
            </Box>
          )}
          {!credit && (
            <Box>
              <TextField
                margin="normal"
                fullWidth
                value={formik2.values.buyer}
                onChange={formik2.handleChange}
                error={Boolean(formik2.errors.buyer) && formik2.touched.buyer}
                helperText={formik2.touched.buyer && formik2.errors.buyer}
                size="small"
                id="buyer"
                label="Buyer Name"
                name="buyer"
                // autoComplete="email"
                autoFocus
              />
            </Box>
          )}
          <Divider />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              pt: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Subtotal: </Typography>
              <Typography>{subtotalvalue?.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Tax: </Typography>
              <Typography>{(subtotalvalue * 0.15)?.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="primary">Total: </Typography>
              <Typography color="primary">
                {(subtotalvalue + subtotalvalue * 0.15)?.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <Divider />
        </CardContent>
        <CardActions>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              type="reset"
              variant="outlined"
              onClick={() => {
                removeCart();
                setSubtotal([]);
                setSubtotalvalue(0);
                setCredit(false);
                formik.resetForm();
              }}
              fullWidth
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              // type="submit"
              onClick={() => setOpen(true)}
              variant="contained"
              disabled={cart.length === 0}
              fullWidth
            >
              Done
            </Button>
          </Box>
        </CardActions>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          onBackdropClick={handleBackdropClick}
          disableEscapeKeyDown
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Sale Information
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Salesperson: {formik.values.seller}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Name: {credit ? formik.values.creditorName : formik2.values.buyer}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1 }}>
              Items
            </Typography>
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
                {cart?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="right">
                      {
                        subtotal.find((product) => product.id === item.id)
                          ?.quantity
                      }
                    </TableCell>
                    <TableCell align="right">
                      {
                        subtotal.find((product) => product.id === item.id)
                          ?.price
                      }
                    </TableCell>
                    <TableCell align="right">
                      {subtotal.find((product) => product.id === item.id)
                        ?.price *
                        subtotal.find((product) => product.id === item.id)
                          ?.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography
              id="modal-modal-description"
              color="primary"
              sx={{ mt: 2 }}
            >
              Total: {subtotalvalue}
            </Typography>
            <Button
              onClick={() => {
                // handleClose(modalData, modalData?.unpaid - paid, false)
                setOpen(false);
              }}
              variant="outlined"
              // disabled={paid > modalData?.unpaid || isNaN(paid)}
              sx={{ mr: 2, mt: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setOpen(false);
                credit ? formik.submitForm() : formik2.submitForm();
                // handleClose(modalData, 0, true);
              }}
              variant="contained"
              // disabled={paid > modalData?.unpaid || isNaN(paid)}
              sx={{ mr: 2, mt: 2 }}
            >
              Sell
            </Button>
          </Box>
        </Modal>
      </Box>
    </Card>
  );
}

export default SaleDetails;
