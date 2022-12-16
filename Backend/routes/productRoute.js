// import express as express
const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");

// first make a Router to handle routes
const router = express.Router(); 

// route to get products
router.get('/products', getAllProducts);

// route to create product
router.post('/products/new', createProduct);

// route to update || delete || get detail of single product
router.put('/products/:id', updateProduct).delete('/products/:id', deleteProduct).get("/products/:id", getProductDetails);




module.exports = router;