const ErrorHandler = require("../utils/errorHandler");


module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Intenal Server Error"

    // Mongo Db error
    if (err.name === "CastError") {
        const message = `Resource not found : ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    // Mongoose Duplicate key Error
    if (err.code == 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400);
    }
    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        
        const message = `Json Web Token is Invalid, try Again`;
        err = new ErrorHandler(message, 400);
    }
    // JWT Expire Error
    if (err.name === "TokenExpiredError") {
        
        const message = `Json Web Token is Expired, try Again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message:err.message
    })
}