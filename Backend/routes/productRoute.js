// import express as express
const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct } = require("../controllers/productController");

// first make a Router to handle routes
const router = express.Router(); 

// route to get products
router.get('/products', getAllProducts);

// route to create product
router.post('/products/new', createProduct);

// route to update product
router.put('/products/:id', updateProduct);

//route to delete product
router.delete('/products/:id', deleteProduct);


module.exports = router;