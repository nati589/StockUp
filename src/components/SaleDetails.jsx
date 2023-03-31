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
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore";

function SaleDetails({ users, cart, removeCart, handleSale }) {
  const [subtotal, setSubtotal] = useState([]);
  const [subtotalvalue, setSubtotalvalue] = useState(0);
  const [credit, setCredit] = useState(false);
  // useEffect(() => {
  // console.log(subtotal)
  // getProducts()
  // }, [])

  const formik = useFormik({
    initialValues: {
      seller: "",
      creditorName: "",
      creditDueDate: "",
    },
    validationSchema: Yup.object({
      seller: Yup.string().required("Select a salesperson"),
      creditorName: Yup.string().required("Required field"),
      creditDueDate: Yup.date().required("Required field"),
    }),
    onSubmit: (values) => {
      console.log(subtotal);
      const submitSale = async () => {
        const batch = writeBatch(db);
        for (let i = 0; i < subtotal.length; i++) {
          const productDoc = doc(db, "products", subtotal[i].id);
          batch.update(productDoc, {
            quantity:
              Number(subtotal[i].previousQuantity) -
              Number(subtotal[i].quantity),
          });
        }
        let date = new Date();
        let myDate = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;
        const saleDoc = collection(db, "sales");
        await addDoc(saleDoc, {
          credit,
          items: subtotal,
          total: subtotalvalue,
          seller: values.seller,
          creditinfo: {
            name: values.creditorName,
            duedate: values.creditDueDate,
            unpaid: subtotalvalue,
            payment_covered: false,
          },
          date_sold: myDate,
        });
        await batch.commit();
      };
      submitSale();
      removeCart();
      setSubtotal([]);
      setSubtotalvalue(0);
      setCredit(false);
    },
  });
  const formik2 = useFormik({
    initialValues: {
      seller: "",
    },
    validationSchema: Yup.object({
      seller: Yup.string().required("Select a salesperson"),
    }),
    onSubmit: (values) => {
      console.log(subtotal);
      const submitSale = async () => {
        const batch = writeBatch(db);
        for (let i = 0; i < subtotal.length; i++) {
          const productDoc = doc(db, "products", subtotal[i].id);
          batch.update(productDoc, {
            quantity:
              Number(subtotal[i].previousQuantity) -
              Number(subtotal[i].quantity),
          });
        }
        let date = new Date();
        let myDate = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;
        await batch.commit();
        const saleDoc = collection(db, "sales");
        await addDoc(saleDoc, {
          credit,
          items: subtotal,
          total: subtotalvalue,
          seller: values.seller,
          date_sold: myDate,
        });
      };
      submitSale();
    },
  });

  const handleSubtotal = (index, output) => {
    let x = subtotal;
    // console.log(x);
    x[index] = { ...x[index], ...output };
    setSubtotal(x);
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
      sum += x[i].price * x[i].quantity;
    }
    setSubtotalvalue(sum);
  };

  // const handleClose = (event, reason) => {
  //   if (reason === "backdropClick") {
  //     console.log(reason);
  //   } else {
  //     setOpen(!open);
  //   }
  // };
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(seller, credit, creditorName, creditDueDate, subtotal);
  //   handleSale(seller, credit, creditorName, creditDueDate, subtotal);
  // };

  // const handleBackdropClick = (event) => {
  //   //these fail to keep the modal open
  //   event.stopPropagation();
  //   return false;
  // };
  // const style = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: 400,
  //   bgcolor: "background.paper",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  //   p: 4,
  // };
  // console.log(cardData, cart)
  return (
    <Card>
      <Typography variant="h6" sx={{ ml: 2 }}>
        Sale Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box
        component="form"
        onSubmit={credit ? formik.handleSubmit : formik2.handleSubmit}
        noValidate>
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
            // helperText={formik.touched.seller && formik.errors.seller}
            sx={{ height: 1 }}>
            {users.map((user, index) => (
              <MenuItem value={user.fullname} key={index}>
                {user.fullname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider />
        <CardContent>
          <Grid container sx={{ mb: 2 }}>
            <Grid item md={4}>
              Item
            </Grid>
            <Grid item md={6}>
              <Typography>Quantity</Typography>
            </Grid>
            <Grid item md={2}>
              Unit Price
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ maxHeight: "30vh", overflowY: "scroll", mb: 1 }}>
            {cart.map((item, index) => (
              <Box key={index}>
                <CartItem
                  cardData={item}
                  index={index}
                  handleSubtotal={handleSubtotal}
                />
                {/* <Divider /> */}
              </Box>
            ))}
          </Box>
          <FormControl>
            <FormLabel id="payment">Payment Method:</FormLabel>
            <RadioGroup
              aria-labelledby="payment"
              defaultValue="cash"
              name="radio-buttons-group">
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
                // autoComplete="email"
                focused
              />
            </Box>
          )}
          <Divider />
          {/* <Modal
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
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="creditor"
                label="Creditor Name"
                name="creditor"
                // autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="duedate"
                label="Due Date"
                name="duedate"
                type="date"
                // autoComplete="email"
                focused
              />
              <Button onClick={handleClose}>Save</Button>
            </Box>
          </Modal> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              pt: 1,
            }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Subtotal: </Typography>
              <Typography>{subtotalvalue.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Tax: </Typography>
              <Typography>{(subtotalvalue * 0.15).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="primary">Total: </Typography>
              <Typography color="primary">
                {(subtotalvalue + subtotalvalue * 0.15).toFixed(2)}
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
            }}>
            <Button
              type="reset"
              variant="outlined"
              onClick={() => {
                removeCart();
                setSubtotal([]);
                setSubtotalvalue(0);
                setCredit(false);
              }}
              fullWidth
              sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={cart.length === 0}
              fullWidth>
              Done
            </Button>
          </Box>
        </CardActions>
      </Box>
    </Card>
  );
}

export default SaleDetails;