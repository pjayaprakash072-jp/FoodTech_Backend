const express = require('express')
const RGroupController = require('../controllers/RGroupController')
const verifyToken = require('../middlewares/verifyToken')

const router = express.Router();

// Route to add a new Restaurant Group (only authenticated vendors)
router.post('/add-rgroup', verifyToken, RGroupController.addRGroup);

// Export the router
module.exports = router;