const Product = require("../models/productModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");
// now to Create product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body) ;
    res.status(201).json({
        success: true,
        product
    })

});

// to get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;// gives Product.find() i.e, all products to the variable.

    if (!products) {
        return next(new Errorhandler("Product not Found", 404))
    }
    res.status(200).json({
        success: true,
        products,
        productCount,
    })
});
// Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res,next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new Errorhandler("Product not Found",404))
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false})
    res.status(200).json({
        success: true,
        product
    })
})
// Delete Product - Admin
exports.deleteProduct = async(req,res,next)=> {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new Errorhandler("Product not Found",404))
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message:"Product Deleted"
    })
}

// get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new Errorhandler("Product not Found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
});