const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

// To ask for login before product creation we authenticate user
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies; // get the token value from cookie parser
    if (!token) {
        return next(new Errorhandler("Please Login to Access this resource", 401)); // if no token in cookie then we give error as no login is there
    }
        const decodedData = jwt.verify(token,process.env.JWT_SECRET) // If token given we verify it using our JWT SECRET
    req.user = await User.findById(decodedData.id); // We find the user id
    next(); // Allow the Resource
})

exports.authorizeRoles = (...roles) => { // func takes the allowed roles in it
    
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) { // if roles array dont have role given to user we give error
           return next( new Errorhandler(`Role: ${req.user.role} is not allowed to acces this resource`, 403));
        } 
        next(); // Else we allow the resource
    };
}