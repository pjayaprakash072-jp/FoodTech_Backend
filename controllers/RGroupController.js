const RGroup = require('../models/RestaurantGroup')
const Vendor = require('../models/Vendor')
const multer = require('multer')
const path = require('path')


// Storage Configuration
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {

        const uniqueName = Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);
    }

});
const upload = multer({
    storage: storage
});

const addRGroup = async (req,res)=>{
    try {
            const {RGroupName, area, category, region, offer} = req.body;

    const image = req.file?req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId)
    if(!vendor){
        return res.status(404).json({message: "vendor not found"})
    }
    const rgroup = new RGroup(
        {
            RGroupName, 
            area, 
            category,
            region,
            offer,
            image , 
            vendor:vendor._id
        }
    )

    const savergroup = await rgroup.save();
    vendor.RGroup.push(savergroup);
    await vendor.save();
    res.status(200).json({message: "Restaurant group added successfully"})
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
        console.log("Error", error)
    }
}

module.exports = {
    addRGroup:[upload.single('image') , addRGroup]
}