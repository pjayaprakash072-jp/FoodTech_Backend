const express = require('express')

const router = express.Router();


const productController = require('../controllers/productController');

const path = require('path')

router.post('/add-product/:rgid',productController.addProduct)

router.get('/:rgid/products',productController.getProductByRGroup)

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName;

    res.headersSent('Content-Type','image/jpeg');

    res.sendFile(Path.join(__dirname,'..','uploads',imageName));
})

module.exports = router