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
    let product = await Product.findById(req.params.id); // find product by id
    if (!product) {
        return next(new Errorhandler("Product not Found",404))
    }
    // update with the body and params 
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false})
    res.status(200).json({
        success: true,
        product
    })
})
// Delete Product - Admin
exports.deleteProduct = async(req,res,next)=> {
    const product = await Product.findById(req.params.id); //find product by id and delete
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
    const product = await Product.findById(req.params.id); // find product By id and return 
    if (!product) {
        return next(new Errorhandler("Product not Found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
});

// Create a Review or Update 
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    // review object having user's name id rating and comment
    const review = { 
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }
    // find the prodict by id and check if this user have reviewed before
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user.id.toString());

    //if reviewed then update the prev review
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user.id.toString()) {
                rev.rating = rating
                rev.comment = comment   
            }
        });
    } else {  // Else push the new array into object
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length; // increase the ocerall review for that product
    }

    //Calculation for avrage reviews for that product
    let avg = 0;
    product.reviews.forEach(rev => {
        avg += Number(rev.rating);
    })
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false }); // save to Database
    res.status(200).json({
        success: true
    })
});

// Get All Reviews for that product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new Errorhandler("Product not Found", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
});
// Delete a review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId); //finding the product by ID from params
    
    if (!product) {
        return next(new Errorhandler("Product not Found", 404))
    }
    const reviews = product.reviews.filter((rev) => // making an array of reviews without the review that is to be deleted
        rev.id.toString() !== req.query.id.toString()
    );

    let avg = 0;
    // calculating average for all ratings of reviews
    reviews.forEach(rev => {
        avg += Number(rev.rating);
    })
    const ratings = avg / reviews.length; // new total ratings value
    const numOfReviews = reviews.length; // new total reviews
    await Product.findByIdAndUpdate(req.query.productId, { // updating in the database
        reviews,
        ratings,
        numOfReviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify:false, 
    });
    
    res.status(200).json({
        success: true,
    })

});