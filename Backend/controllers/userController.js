const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const { findOne, findByIdAndUpdate } = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")

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

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => { 
    // Fetching the Email of the client
    const user = await User.findOne({ email: req.body.email });
    //check if any user of given email present
    if (!user) {
        return next(new Errorhandler("User not found", 404));
    }
    // if found get the reset token
    const resetToken =await user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false }); // to save the changes made on resetPsswordExpire and resetPasswordToken in DB
    
    // URL that will be sent through email
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password Reset Token is :- \n\n ${resetPasswordUrl} \n\n If you have note requested this email then, Please ignore it.`
    try { // try sending the Email
        await sendEmail({
            email:  user.email,
            subject: `Kirana Password Recovery`,
            message,

        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully!`
            
        })
        
    } catch (error) { // If Email can't be sent immediately make variables undefined in databse
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false }); 
        return next(new Errorhandler(error.message, 500));
    }

})

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex"); //making hash of the token
    
    const user = await User.findOne({
        resetPasswordExpire : {$gt:Date.now()}, // check if the oken have not expired
        resetPasswordToken
    })
     // if no user found
    if (!user) {
        return next(new Errorhandler("Reset Password Token is invalid or has been expired.", 404));
    }
     // check for both params to be same pass = confirmPass
    if (req.body.password !== req.body.confirmPassword) {
        return next(new Errorhandler("Password does not match.", 404));
    }
    // Change In Databses
    user.password = req.body.password; 
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    
    // Save in database
    await user.save(); 
    
    // Login at the same time and save cookie
    sendToken(user, 200, res); 
})

//  get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})
//  Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("password");
    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    
    if (!isPasswordMatched) {
        return next(new Errorhandler("Old Password is incorrect",401));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new Errorhandler("Password does not match.", 404));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
    res.status(200).json({
        success: true,
        user
    })
})

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUser, {
        new: true,
        runValidators: true,
        useFindAndModify:false
    })
    res.status(200).json({
        success: true
    })
})

//Get all Users -- Admin
exports.getAllUser = catchAsyncErrors(async (req, res,next) => {
    const users = await User.find(); //getting all users using find()
    res.status(200).json({
        success: true,
        users,
    })
})

//Get Single Users -- Admin
exports.getSingleUser = catchAsyncErrors(async (req, res,next) => {
    const user = await User.findById(req.params.id); //getting the target id
    if (!user) {
        return next(new Errorhandler(`User Does Not Exist with ID: ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user,
    })
})