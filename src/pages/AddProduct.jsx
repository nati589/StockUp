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
// import AddIcon from '@mui/icons-material/Add';
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import api from "../lib/api";
// import { db } from "../config/firebase";
// import {
//   getDocs,
//   collection,
//   addDoc,
//   updateDoc,
//   doc,
//   writeBatch,
// } from "firebase/firestore";

function AddProduct() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const addedBy = localStorage.getItem("fullName");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [restock, setRestock] = useState("");
  const priceBought = 0;

  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [newProduct, setNewProduct] = useState(false);
  const [newCategory, setNewCategory] = useState(false);
  // const productsRef = collection(db, "products");
  // const categoryRef = collection(db, "categories");

  const getDetails = async () => {
    const [products, categories] = await Promise.all([
      api.get("/products"),
      api.get("/categories"),
    ]);
    setProductList(products.data);
    setCategoryList(categories.data);
  };
  useEffect(() => {
    getDetails();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const date = new Date();
    const myDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    if (!newProduct) {
      const productId = productList.find((p) => p.name === product)._id;
      await api.put(`/products/${productId}`, {
        quantity:
          Number(quantity) +
          Number(productList.find((p) => p._id === productId).quantity),
        date_added: myDate,
        added_by: addedBy,
        restock:
          restock === ""
            ? productList.find((p) => p._id === productId)?.restock
            : Number(restock),
      });
    } else {
      await api.post("/products", {
        name: product,
        category,
        price_bought: String(0),
        date_added: myDate,
        added_by: addedBy,
        quantity: Number(quantity),
        unit,
        restock: Number(restock),
      });
      if (!categoryList.find((c) => c.name === category)) {
        await api.post("/categories", { name: category });
      }
    }
    setOpenSnackbar(true);
    setCategory("");
    setProduct("");
    setUnit("");
    setQuantity("");
    setNewProduct(false);
    setNewCategory(false);
    setRestock("");
  };
  return (
    <Grid container sx={{ pl: 2, pr: 2 }}>
      <Typography variant="h4">New Arrival</Typography>
      <Grid item xs={12}>
        <Card elevation={0}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", mt: 2, mb: 1 }}>
              {!newProduct && (
                <FormControl fullWidth>
                  <InputLabel id="products">Products</InputLabel>
                  <Select
                    labelId="products"
                    id="productid"
                    label="Product"
                    value={product}
                    onChange={(event) => setProduct(event.target.value)}
                  >
                    {productList.map((item, index) => (
                      <MenuItem value={item.name} key={index}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {newProduct && (
                <TextField
                  // margin="normal"
                  required
                  fullWidth
                  id="product"
                  label="New Product"
                  name="product"
                  onChange={(event) => setProduct(event.target.value)}
                />
              )}
              <Button
                onClick={() => {
                  setNewProduct(!newProduct);
                  setProduct("");
                }}
              >
                {newProduct ? "Cancel" : "Add"}
                {/* <AddIcon /> */}
              </Button>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {newProduct && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="unit"
                  label="Unit"
                  onChange={(event) => setUnit(event.target.value)}
                  name="unit"
                  sx={{ mr: 2 }}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                id="quantity"
                label="Quantity"
                sx={{ mr: 2 }}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                name="quantity"
              />
            </Box>
            {newProduct && (
              <Box sx={{ display: "flex", mt: 2, mb: 1 }}>
                {!newCategory && (
                  <FormControl fullWidth>
                    <InputLabel id="categories">Categories</InputLabel>
                    <Select
                      labelId="categories"
                      id="category"
                      label="Categories"
                      value={category}
                      onChange={(event) => {
                        setCategory(event.target.value);
                      }}
                    >
                      {categoryList.map((item, index) => (
                        <MenuItem value={item.name} key={index}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {newCategory && (
                  <TextField
                    // margin="normal"
                    required
                    fullWidth
                    id="category"
                    onChange={(event) => setCategory(event.target.value)}
                    label="New Category"
                    name="category"
                  />
                )}
                <Button onClick={() => setNewCategory(!newCategory)}>
                  {newCategory ? "Cancel" : "Add"}
                  {/* <AddIcon /> */}
                </Button>
              </Box>
            )}
            {newProduct && (
              <FormControl fullWidth>
                <InputLabel id="addedbylabel">Added By</InputLabel>
                <Select
                  labelId="addedbylabel"
                  id="addedby"
                  label="AddedBy"
                  value={addedBy}
                >
                  <MenuItem value={addedBy}>{addedBy}</MenuItem>
                </Select>
              </FormControl>
            )}
            <TextField
              margin="normal"
              fullWidth
              type="number"
              id="restock"
              label="Restock Limit"
              sx={{ mr: 2 }}
              value={restock}
              onChange={(event) => setRestock(event.target.value)}
              name="restock"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </Box>
        </Card>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity="success"
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}
        >
          Product added successfully
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default AddProduct;
