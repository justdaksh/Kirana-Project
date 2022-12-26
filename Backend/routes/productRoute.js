// import express as express
const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// first make a Router to handle routes
const router = express.Router(); 

// route to get products
router.get('/products', getAllProducts);

// route to create product
router.post('/products/new',isAuthenticatedUser,authorizeRoles("admin"), createProduct);

// route to update || delete || get detail of single product
router.put('/products/:id',isAuthenticatedUser,authorizeRoles("admin"), updateProduct).delete('/products/:id',isAuthenticatedUser,authorizeRoles("admin"), deleteProduct).get("/products/:id", getProductDetails);




module.exports = router;