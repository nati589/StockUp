// import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { db } from "../config/firebase";
// import {
//   getDocs,
//   collection,
//   addDoc,
//   updateDoc,
//   doc,
//   writeBatch,
// } from "firebase/firestore";
import { Alert, Snackbar } from "@mui/material";
import api from "../lib/api";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Stock Management System
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Login() {
  // const usersRef = collection(db, "users");
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // const users = async () => {};
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required field"),
      password: Yup.string()
        .required("Required field")
        .min(6, "Must be at least 6 characters"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await api.post("/auth/login", {
          username: values.username,
          password: values.password
        });
        // data: { token, user: { id, username, fullname, admin } }
        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", "true");
        localStorage.setItem("loggedInStatus", String(!!data.user.admin)); // "true" for admin, "false" for salesperson
        if (data.user.fullname) localStorage.setItem("fullName", data.user.fullname);
        setLoggedIn(true);
      } catch {
        setOpenSnackbar(true);
      }
    },
  });
  useEffect(() => {
    const getUser = localStorage.getItem("loggedInUser");
    const getStatus = localStorage.getItem("loggedInStatus");
    // console.log(toBoolean(getUser), Boolean(getStatus))
    if (getUser === "true" && getStatus === "false") {
      navigate("/salesperson");
    } else if (getUser === "true" && getStatus === "true") {
      navigate("/admin");
    }
  }, [loggedIn]);

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.username) && formik.touched.username}
              helperText={formik.touched.username && formik.errors.username}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.password) && formik.touched.password}
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        {/* I want to add a demo section with user and admin demo login buttons, and login with the values i give you */}
        <Typography variant="body1" sx={{ mb: 2, mt: 4 }}>Demo Login:</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" color="primary" onClick={() => {
            formik.setValues({ username: "salesperson", password: "123456" });
            // formik.handleSubmit();
          }}>
            Salesperson Demo Login
          </Button>
          <Button type="submit" variant="contained" color="primary" onClick={() => {
            formik.setValues({ username: "admin", password: "123456" });
            // formik.handleSubmit();
          }}>
            Admin Demo Login
          </Button>
        </Box>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}>
          <Alert
            severity="error"
            onClose={() => setOpenSnackbar(false)}
            sx={{ width: "100%" }}>
            Login Failed
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default Login;
