const vendorController = require('../controllers/vendorController')

const express = require('express')

const router = express.Router();

// Route for vendor registration
router.post('/register', vendorController.vendorRegister);

// Route for vendor login
router.post('/login', vendorController.vendorLogin);

// Export the router
module.exports = router;