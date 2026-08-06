const express = require('express')
const RGroupController = require('../controllers/RGroupController')
const verifyToken = require('../middlewares/verifyToken')


const router = express.Router();

// Route to add a new Restaurant Group (only authenticated vendors)
router.post('/add-rgroup', verifyToken, RGroupController.addRGroup);

// router.get('/uploads/:imageName',(req,res)=>{
//     const imageName = req.params.imageName;

//     res.headersSent('Content-Type','image/jpeg');

//     res.sendFile(path.join(__dirname,'..','uploads',imageName));
// })
router.delete('/delete/:rgid',RGroupController.deleteRGroup)


// Export the router
module.exports = router;