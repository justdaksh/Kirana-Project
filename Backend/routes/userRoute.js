const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } = require("../controllers/userController");
const router = express.Router();

router.post('/register', registerUser); // route to register user

router.post('/login', loginUser); // route to login user

router.post('/password/forgot', forgotPassword) // route for forgot password

router.put('/password/reset/:token',resetPassword) // route to reset password

router.post('/logout', logoutUser);//route to logut User

module.exports = router;