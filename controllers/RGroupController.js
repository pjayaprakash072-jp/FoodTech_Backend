const RGroup = require('../models/RestaurantGroup')
const Vendor = require('../models/Vendor')
const multer = require('multer')
const path = require('path')

const Product = require('../models/Product')

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
const addRGroup = async (req, res) => {
    try {

        // Get restaurant details from request body
        const { RGroupName, area, category, region, offer } = req.body;

        // Get uploaded image filename (if any)
        const image = req.file ? req.file.filename : undefined;

        // Find the logged-in vendor
        const vendor = await Vendor.findById(req.vendorId);

        if (!vendor) {
            return res.status(404).json({ message: "vendor not found" });
        }

        // Create a new Restaurant Group
        const rgroup = new RGroup({
            RGroupName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });

        // Save Restaurant Group to the database
        const savergroup = await rgroup.save();

        // Add the Restaurant Group reference to the vendor
        vendor.RGroup.push(savergroup);
        await vendor.save();

        res.status(200).json({ message: "Restaurant group added successfully" });

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error", error);
    }
}


// const deleteRGroup = async (req,res)=>{
//     try {
//         const rgid = req.params.rgid;

//         const rgroup = await RGroup.findByIdAndDelete(rgid);
//         if(!rgroup){
//             return res.status(400).json({message:"Restaurant group is not found"})
//         }
        
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//         console.log("Error", error);
//     }
// }

const deleteRGroup = async (req, res) => {
    try {
        const rgid = req.params.rgid;

        // Find the restaurant group
        const rgroup = await RGroup.findById(rgid);

        if (!rgroup) {
            return res.status(404).json({
                message: "Restaurant group not found"
            });
        }

        // Delete all products belonging to this restaurant group
        await Product.deleteMany({ RGroup: rgid });

        // Remove the restaurant group ID from the vendor
        await Vendor.findByIdAndUpdate(
            rgroup.vendor[0],
            {
                $pull: { RGroup: rgid }
            }
        );

        // Delete the restaurant group
        await RGroup.findByIdAndDelete(rgid);

        res.status(200).json({
            message: "Restaurant group deleted successfully"
        });

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};
module.exports = {
    // Upload image first, then execute addRGroup controller
    addRGroup: [upload.single('image'), addRGroup],deleteRGroup
}