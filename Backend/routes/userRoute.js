const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/userController");
const router = express.Router();

router.post('/register', registerUser); // route to register user

router.post('/login', loginUser); // route to login user

router.post('/logout', logoutUser);//route to logut User

module.exports = router;