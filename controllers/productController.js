const Product = require('../models/Product')
const RGroup = require('../models/RestaurantGroup')
const multer = require('multer')
const path = require('path')

// Storage configuration for uploaded images
const storage = multer.diskStorage({

    // Folder where images will be stored
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    // Generate a unique filename
    filename: function (req, file, cb) {

        const uniqueName = Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);
    }

});

// Configure multer with the storage settings
const upload = multer({
    storage: storage
});

// Controller to add a new Restaurant Group

const addProduct = async (req, res)=>{
    const rgroupid = req.params.rgid;

    try {
        const {productName, price, category, bestSeller, description} = req.body;

        const image = req.file ? req.file.filename : undefined;

        const rgroup = await RGroup.findById(rgroupid)
        if(!rgroup){
            return res.status(400).json({error: "Restaruent group is not found"});
        }

        const product = new Product({
            productName, price, category, bestSeller, description,image, RGroup:rgroup._id
        })

        const saveproduct = await product.save();
        rgroup.Products.push(saveproduct)
        await rgroup.save();
        res.status(200).json({message:"product added successfully"})
        
    } catch (error) {
        res.status(500).json({error:"Internal error"})
        console.log("Error" , error)
    }
}

module.exports = {
    addProduct: [upload.single("image"), addProduct]
}