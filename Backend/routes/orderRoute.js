const express = require("express");
const { newOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// route to create newOrder
router.post('/order/new',isAuthenticatedUser, newOrder);


module.exports = router;