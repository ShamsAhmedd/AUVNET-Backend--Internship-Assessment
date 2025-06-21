const express = require('express');
const auth = require("../../middlewares/auth");
const adminController = require('../../controllers/admin/AdminCrud');

const router = express.Router();

// /api/admin/addAdmin 
router.post('/addAdmin',auth, adminController.createAdmin);

// /api/admin/getAllAdmins
router.get('/getAllAdmins',auth, adminController.getAllAdmins);

// /api/admin/updateAdmin/:id
router.put('/updateAdmin/:id',auth,adminController.updateAdmin);

// /api/admin/deleteAdmin/:id
router.delete('/deleteAdmin/:id',auth,adminController.deleteAdmin);

module.exports=router;