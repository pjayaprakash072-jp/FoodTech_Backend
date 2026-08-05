const express = require('express')
const RGroupController = require('../controllers/RGroupController')
const verifyToken = require('../middlewares/verifyToken')

const router = express.Router();

router.post('/add-rgroup' , verifyToken, RGroupController.addRGroup)

module.exports = router;