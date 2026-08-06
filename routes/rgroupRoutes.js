const express = require('express')
const RGroupController = require('../controllers/RGroupController')
const verifyToken = require('../middlewares/verifyToken')
const path = require('path')

const router = express.Router();

// Route to add a new Restaurant Group (only authenticated vendors)
router.post('/add-rgroup', verifyToken, RGroupController.addRGroup);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName;

    res.headersSent('Content-Type','image/jpeg');

    res.sendFile(Path.join(__dirname,'..','uploads',imageName));
})

// Export the router
module.exports = router;