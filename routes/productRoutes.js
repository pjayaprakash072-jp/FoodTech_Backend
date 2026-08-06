const express = require('express')

const router = express.Router();


const productController = require('../controllers/productController');
const { route } = require('./vendorRoutes');


router.post('/add-product/:rgid',productController.addProduct)

module.exports = router