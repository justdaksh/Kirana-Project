const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser } = require("../controllers/userController");
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth")
const router = express.Router();

router.post('/register', registerUser); // route to register user

router.post('/login', loginUser); // route to login user

router.get('/profile',isAuthenticatedUser, getUserDetails); //route to get User Details 

router.post('/password/forgot', forgotPassword) // route for forgot password

router.put('/password/reset/:token',resetPassword) // route to reset password

router.put('/password/update', isAuthenticatedUser, updatePassword) // route to reset password

router.put('/profile/update', isAuthenticatedUser, updateProfile) // route to reset password

router.get('/admin/users', isAuthenticatedUser, authorizeRoles("admin"), getAllUser) // Route to get All Users --admin

router.get('/admin/user/:id',isAuthenticatedUser,authorizeRoles("admin"),getSingleUser) // Route to get Single User --admin

router.post('/logout', logoutUser);//route to logut User

module.exports = router;