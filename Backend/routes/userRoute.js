const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const router = express.Router();

router.post('/register', registerUser); // route to register user

router.post('/login', loginUser); // route to login user

module.exports = router;