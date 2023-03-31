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
import { db } from "../config/firebase";
import { getDocs, collection, addDoc, updateDoc, doc, writeBatch } from "firebase/firestore";

function AddProduct() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const priceBought = 0;

  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [newProduct, setNewProduct] = useState(false);
  const [newCategory, setNewCategory] = useState(false);
  const productsRef = collection(db, "products");
  const categoryRef = collection(db, "categories");
  const usersRef = collection(db, "users");

  const getDetails = async () => {
    try {
      const productData = await getDocs(productsRef);
      const filteredProducts = productData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProductList(filteredProducts);

      const categoryData = await getDocs(categoryRef);
      const filteredCategories = categoryData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategoryList(filteredCategories);

      const userData = await getDocs(usersRef);
      const filteredUsers = userData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserList(filteredUsers);
      // console.log(filteredUsers);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDetails();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newProduct) {
      try {
        let productId = productList.find((item) => item.name === product)
        const productDoc = doc(db, "products", productId.id)
        console.log(quantity, productId.quantity)
        await updateDoc(productDoc, { quantity: (Number(quantity) + Number(productId.quantity)) }).then(() => setOpenSnackbar(true))
        getDetails();
      } catch (error) {
        console.error(error);
      }
    } else {
      let date = new Date();
      let myDate = `${
        date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
      try {
        await addDoc(productsRef, {
          name: product,
          category,
          price_bought: priceBought,
          date_added: myDate,
          added_by: addedBy,
          quantity,
          unit,
        }).then(() => setOpenSnackbar(true));
        await addDoc(categoryRef, { name: category });
      } catch (err) {
        console.error(err);
      }
    }
    console.log("done");
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
                    onChange={(event) => setProduct(event.target.value)}>
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
                }}>
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
                      }}>
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
                  onChange={(event) => setAddedBy(event.target.value)}>
                  {userList.map((item, index) => (
                    <MenuItem value={item.fullname} key={index}>
                      {item.fullname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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
        onClose={() => setOpenSnackbar(false)}>
        <Alert
          severity="success"
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}>
          Product added successfully
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default AddProduct;