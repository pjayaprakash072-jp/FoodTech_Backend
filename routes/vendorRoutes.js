const vendorController = require('../controllers/vendorController')

const express = require('express')

const router = express.Router();

router.post('/register' , vendorController.vendorRegister)

module.exports = router;
