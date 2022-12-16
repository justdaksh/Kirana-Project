const ErrorHandler = require("../utils/errorHandler");


module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Intenal Server Error"

// Mongo Db error
    if (err.name === "CastError") {
        const message = `Respurce not found : ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message:err.message
    })
}