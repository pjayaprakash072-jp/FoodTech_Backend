const express = require('express')

const router = express.Router();


const productController = require('../controllers/productController');


router.post('/add-product/:rgid',productController.addProduct)

router.get('/:rgid/products',productController.getProductByRGroup)

router.delete('/delete/:pid',productController.deleteProduct)

module.exports = router