const vendorController = require('../controllers/vendorController')

const express = require('express')

const router = express.Router();

// Route for vendor registration
router.post('/register', vendorController.vendorRegister);

// Route for vendor login
router.post('/login', vendorController.vendorLogin);

router.get('/all-vendors',vendorController.getallVendors)

router.get('/single-vendor/:id',vendorController.singleVendor)
router.delete('/delete/:id',vendorController.deleteVendor)

// Export the router
module.exports = router;