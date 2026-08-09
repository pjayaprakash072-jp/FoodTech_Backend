const fs = require('fs')
const { error } = require('console');
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
    
    try {   
        const rgroupid = req.params.rgid;
        const {productName, price, category, bestSeller, description} = req.body;

        const image = req.file ? req.file.filename : undefined;

        const rgroup = await RGroup.findById(rgroupid)
        if(!rgroup){
            return res.status(404).json({error: "Restaruent group is not found"});
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

const getProductByRGroup = async(req,res)=>{ 
    try {
        const rgid = req.params.rgid;

        const rgroup = await RGroup.findById(rgid);
        if(!rgroup){
            return res.status(404).json({error:"Restaurant group is not found"});
        }

        const RestairamtName = rgroup.RGroupName;

        const products = await Product.find({RGroup : rgid})

        res.status(200).json({RestairamtName,products})
        
    } catch (error) {
        res.status(500).json({error:"Internal server erro"})
        console.log("Error",error)
        
    }
}

// const Vendor = require('../models/Vendor');

// const getProductByRGroup = async (req, res) => {
//     try {
//         const rgid = req.params.rgid;

//         const rgroup = await RGroup.findById(rgid);

//         if (!rgroup) {
//             return res.status(404).json({
//                 message: "Restaurant group is not found"
//             });
//         }

//         const vendor = await Vendor.findById(rgroup.vendor[0]);

//         const products = await Product.find({ RGroup: rgid });

//         res.status(200).json({
//             vendor: vendor.username,
//             RGroup: rgroup.RGroupName,
//             products: products.map(product => product.productName)
//         });

//     } catch (error) {
//         console.log("Error", error);
//         res.status(500).json({
//             error: "Internal server error"
//         });
//     }
// };

const deleteProduct = async(req,res)=>{
    try {
        const pid = req.params.pid;

        const delproduct = await Product.findById(pid);
        if(!delproduct){
            return res.status(404).json({error:"No product found"});
        }
        // deleting the image from the uploads 
        if(delproduct.image){
            const imgpath = path.join(__dirname,'..','uploads',delproduct.image)
            try{
                await fs.promises.unlink(imgpath);
                console.log("Image deleted:", delproduct.image);
            } catch (fileError) {
                // If image doesn't exist, don't stop product deletion
                if (fileError.code !== 'ENOENT') {
                    console.log("Image deletion error:", fileError);
                }
            }
        }
        await Product.findByIdAndDelete(pid);
        // Remove the product id from the RGroup
        await RGroup.findByIdAndUpdate(
            delproduct.RGroup,
            {
                $pull: {
                    Products: pid
                }
            }
        );

        res.status(200).json({
            message: "Product deleted successfully"
        });

            
    } catch (error) {
        res.status(500).json({error:"Internal server erro"})
        console.log("Error",error)
    }
}
module.exports = {
    addProduct: [upload.single("image"), addProduct],getProductByRGroup,deleteProduct
}