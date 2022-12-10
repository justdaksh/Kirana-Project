// import express as express
const express = require("express");
const { getAllProducts } = require("../controllers/productController");

// first make a Router to handle routes
const router = express.Router(); 

router.route("/products").get(getAllProducts)



module.exports = router;