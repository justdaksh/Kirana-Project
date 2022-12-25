
const bodyParser = require("body-parser");
const path = require("path");
const errorMiddleware = require("./middleware/error")

// for express
const express = require("express");
const app = express();
app.use(express.json());

// for body parser
app.use(bodyParser.urlencoded({ extended: true }));

// importing Routes
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");

// Base Route for Product Operations
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);

// Middleware for error
app.use(errorMiddleware);

module.exports = app;