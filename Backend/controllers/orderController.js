const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");

// Creating New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    // required fields taken from input
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user.id, // info about user who ordered is gathered
    });
    res.status(201).json({
        success: true,
        order
    });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    // getting order id and adding user's name and email in output using populate 
    const order = await Order.findById(req.params.id).populate("user", "name email"); 
    if (!order) {
        return next(new Errorhandler("Order Not found with this Id",404))
    }
    res.status(201).json({
        success: true,
        order
    })
})
// Get logged in User's Order
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    
    const order = await Order.find({ user: req.user.id }); // req.user gives info about current user
    // so we take id from info and find his order
    
    res.status(201).json({
        success: true,
        order
    })
})
// Get ALl Orders --Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    
    const orders = await Order.find(); // Admins finds all orders on website

    let totalAmount = 0; // shows total orders ka amount ... only for admin
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });
    
    res.status(201).json({
        success: true,
        totalAmount,
        orders
    });
});
// Update Order Status
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    
    const order = await Order.findById(req.params.id);
    if (!order) {
        return (new Errorhandler("Order Not found with this id"), 404);  
    }
    // check current status of order
    if (order.orderStatus === "Delivered") {
        return next(new Errorhandler("You have already delivered this order", 404));
    }
    // for each order we update the product stock 
    order.orderItems.forEach(async order => {
        await updateStock(order.product, order.quantity);
    });
    // change order status according to admin input
    order.orderStatus = req.body.status;
    // update delivery date
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(201).json({
        success: true,
        
    });
});
// function to update stock
async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
}
// Delete Order
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    
    const order = await Order.findById(req.params.id);
    if (!order) {
        return (new Errorhandler("Order Not found with this id"), 404);  
    }
    await order.remove(); // Deleting the order from the database

    res.status(201).json({
        success: true,
    });
});

