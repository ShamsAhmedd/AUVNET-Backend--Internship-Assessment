const express = require('express');

const AuthController = require('../controllers/Authentication');

const router = express.Router();

// /api/auth/Register 
router.post('/Register', AuthController.Register);

// /api/auth/Login
router.post('/Login',AuthController.Login)

module.exports=router;