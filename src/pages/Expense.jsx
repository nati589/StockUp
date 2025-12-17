import {
  Alert,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
// import { db } from "../config/firebase";
// import { collection, addDoc } from "firebase/firestore";
import api from "../lib/api";
import { useFormik } from "formik";
import * as Yup from "yup";

function Expense() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const expenseRef = api.get("/expenses");

  const formik = useFormik({
    initialValues: {
      type: "",
      phoneNumber: "",
      verification: "",
      price: "",
    },
    validationSchema: Yup.object({
      type: Yup.string().required("Required field"),
      verification: Yup.string().required("Required field"),
      price: Yup.number().required("Required field"),
      phoneNumber: Yup.string()
        .required("Required field")
        .min(8, "Must be at least 8 digits"),
    }),
    onSubmit: (values, { resetForm }) => {
      addExpense(values);
      resetForm({ values: "" });
    },
  });

  const addExpense = async (values) => {
    let date = new Date();
    let myDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    try {
      await api.post("/expenses", {
        type: values.type,
        date_added: myDate,
        price: values.price,
        verification: values.verification,
        phoneNumber: values.phoneNumber,
      }).then(() => setOpenSnackbar(true));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Grid container sx={{ pl: 2, pr: 2 }}>
      <Typography variant="h4">Expense</Typography>
      <Grid item xs={12}>
        <Card elevation={0}>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Box sx={{ display: "flex", mt: 2, mb: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="expense">Type of Expense</InputLabel>
                <Select
                  labelId="expense"
                  id="type"
                  label="Expense Type"
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.type) && formik.touched.type}>
                  <MenuItem value={"Loading"}>Loading</MenuItem>
                  <MenuItem value={"Transport"}>Transport</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                id="price"
                label="Price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.price) && formik.touched.price}
                helperText={formik.touched.price && formik.errors.price}
                sx={{ mr: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="verification"
                label="Verificaion"
                value={formik.values.verification}
                onChange={formik.handleChange}
                error={
                  Boolean(formik.errors.verification) &&
                  formik.touched.verification
                }
                helperText={
                  formik.touched.verification && formik.errors.verification
                }
                name="verification"
              />
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={
                Boolean(formik.errors.phoneNumber) && formik.touched.phoneNumber
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
              sx={{ mr: 2 }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="filled"
                type="reset"
                onClick={() => formik.resetForm()}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" sx={{ ml: 2 }}>
                Register
              </Button>
            </Box>
          </Box>
        </Card>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}>
        <Alert
          severity="success"
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}>
          Expense added successfully
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default Expense;
