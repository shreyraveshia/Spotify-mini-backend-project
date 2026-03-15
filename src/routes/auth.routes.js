const express = require('express');
const authController = require('../controllers/auth.controller');


const router = express.Router(); 
// router is used to create different routes for different functionalities. 
// like auth related routes, music related routes etc. 
// so that we can keep our code organized and modular.

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);



module.exports = router;