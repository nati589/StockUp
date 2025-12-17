import {
  Alert,
  Button,
  Card,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
// import { db } from "../config/firebase";
// import { collection, addDoc } from "firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../lib/api";

export default function AddUser() {
  const usersRef = api.get("/users");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required field"),
      username: Yup.string().required("Required field"),
      password: Yup.string()
        .required("Required field")
        .min(6, "Must be at least 6 characters"),
    }),
    onSubmit: (values, { resetForm }) => {
      addNewUser(values);
      resetForm({ values: "" });
    },
  });
  const addNewUser = async (values) => {
    try {
      await api.post("/users", {
        admin: false,
        disable: false,
        fullname: values.fullName,
        username: values.username,
        password: values.password,
      }).then(() => {
        setOpenSnackbar(true);
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Grid container sx={{ pl: 2, pr: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        New User
      </Typography>
      <Grid item xs={12}>
        <Card elevation={0}>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              margin="normal"
              //   required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.fullName) && formik.touched.fullName}
              helperText={formik.touched.fullName && formik.errors.fullName}
              sx={{ mr: 2 }}
            />
            <TextField
              margin="normal"
              //   required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.username) && formik.touched.username}
              helperText={formik.touched.username && formik.errors.username}
              sx={{ mr: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.password) && formik.touched.password}
              helperText={formik.touched.password && formik.errors.password}
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
          User added successfully
        </Alert>
      </Snackbar>
    </Grid>
  );
}
