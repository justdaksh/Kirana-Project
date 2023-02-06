
const bodyParser = require("body-parser");
const path = require("path");
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser");

// for express
const express = require("express");
const app = express();
app.use(express.json());

// for body parser
app.use(bodyParser.urlencoded({ extended: true }));

//for cookie parser
app.use(cookieParser())

// importing Routes
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");

// Base Route for Product Operations
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);

// Middleware for error
app.use(errorMiddleware);

module.exports = app;