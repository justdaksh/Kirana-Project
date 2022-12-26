const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const { findOne } = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is sample id",
            url: "this is sample url",
        },
    });
    sendToken(user, 201, res); //calls for token 


});


//login for a User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body; //takes original email and password
    
    //check if either user email or pass not provided
    if (!email || !password) {
        return next(new Errorhandler("Please Enter Email or Password", 400));
        
    }
    const user = await User.findOne({ email }).select("password"); //finds the email and password now

    if (!user) {
        return next(new Errorhandler("Invalid Email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new Errorhandler("Invalid Email or password",401));
    }

    sendToken(user, 200,res);
})

//logout User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
})