const express = require('express');
const adminUserController = require('../../controllers/admin/User');
const router = express.Router();


// GET /api/admin/getAllUsers
router.get('/getAllUsers', adminUserController.getAllUsers);

// DELETE /api/admin/deleteUser/:id
router.delete('/deleteUser/:id', adminUserController.deleteUser);

module.exports=router