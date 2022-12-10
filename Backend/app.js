
const bodyParser = require("body-parser");
const path = require("path");

// for express
const express = require("express");
const app = express();
app.use(express.json());

// for body parser
app.use(bodyParser.urlencoded({ extended: true }));

// importing Routes
const product = require("./routes/productRoute");


// Base Route for Product Operations
app.use("/api/v1",product);



module.exports = app;