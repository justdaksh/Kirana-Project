const express = require("express");
const { newOrder, myOrders, getSingleOrder, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// route to create newOrder
router.post('/order/new',isAuthenticatedUser, newOrder);
router.get('/orders/me',isAuthenticatedUser, myOrders);
router.get('/order/:id', isAuthenticatedUser, getSingleOrder)
router.get('/admin/orders', isAuthenticatedUser, authorizeRoles("admin"), getAllOrders)
    .put('/admin/order/:id', isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete('/admin/order/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)
module.exports = router;