// import express as express
const express = require("express");
const { getAllProducts,createProduct } = require("../controllers/productController");

// first make a Router to handle routes
const router = express.Router(); 

// route to get products
router.get('/products', getAllProducts);

// route to create product
router.post('/products/new',createProduct);



module.exports = router;