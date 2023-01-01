// import express as express
const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// first make a Router to handle routes
const router = express.Router(); 

// route to get products
router.get('/products', getAllProducts);

// route to create product
router.post('/admin/products/new',isAuthenticatedUser,authorizeRoles("admin"), createProduct);

// route to update || delete || get detail of single product
router.put('/admin/products/:id',isAuthenticatedUser,authorizeRoles("admin"), updateProduct).delete('/admin/products/:id',isAuthenticatedUser,authorizeRoles("admin"), deleteProduct).get("/products/:id", getProductDetails);

//route to Create a Review
router.put('/review',isAuthenticatedUser,createProductReview)



module.exports = router;