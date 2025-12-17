import { SearchOutlined } from "@mui/icons-material";
import { Alert, alpha, Snackbar } from "@mui/material";
import { InputBase } from "@mui/material";
import { Grid } from "@mui/material";
import { styled } from "@mui/system";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Categories from "../components/Categories";
import Products from "../components/Products";
import api from "../lib/api";
// import { db } from "../config/firebase";
// import { getDocs, collection } from "firebase/firestore";
import SaleDetails from "../components/SaleDetails";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  // marginRight: theme.spacing(3),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    borderRadius: "5px",
    backgroundColor: alpha(theme.palette.common.black, 0.1),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.05),
    },
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function Sales() {
  // const productsRef = collection(db, "products");
  // const categoryRef = collection(db, "categories");
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [categories, setCategories] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const getProducts = async () => {
    try {
      const { data } = await api.get("/products");
      const normalized = data.map(p => ({ ...p, id: p._id })); // ensure id exists
      setProducts(normalized);
      setSortedProducts(normalized);
    } catch (error) {
      setOpenSnackbar(true);
    }
  };
  const getCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProducts();
    getCategories();
  }, []);
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    if (!cart.includes(product)) {
      setCart([...cart, product]);
    }
  };
  const removeCart = () => {
    setCart([]);
  };
  const removeCartItem = (id) => {
    setCart(prev => {
      return prev.filter((item) => item.id != id)
    })
  } 
  const handleSort = (event) => {
    if (event === "All") {
      setSortedProducts(products);
    } else {
      setSortedProducts(products.filter((item) => item.category === event));
    }
  };

  return (
    <Grid container spacing={1} sx={{ pl: 1, pr: 1 }}>
      <Grid item xs={8} md={7}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pl: 2,
            pr: 2,
          }}>
          <Categories data={categories} handleSort={handleSort} />
          <Search>
            <SearchIconWrapper>
              <SearchOutlined />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={(event) => setSearchData(event.target.value)}
            />
          </Search>
        </Box>
        <Box sx={{ maxHeight: "75vh", overflowY: "scroll", pl: 2, pr: 2 }}>
          <Products
            data={
              searchData === ""
                ? sortedProducts
                : sortedProducts.filter((sortedProduct) =>
                    sortedProduct.name
                      .toLowerCase()
                      .includes(searchData.toLowerCase())
                  )
            }
            addToCart={addToCart}
          />
        </Box>
      </Grid>
      <Grid item xs={4} md={5} sx={{ maxHeight: "80vh" }}>
        <SaleDetails
          cart={cart}
          removeCart={removeCart}
          handleSnackbarOpen={setOpenSnackbar}
          removeCartItem={removeCartItem}
          refreshProducts={getProducts}
        />
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}>
        <Alert
          severity="success"
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}>
          Sale registered
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default Sales;
