const RGroup = require("../models/RestaurantGroup");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;


// ==========================================
// CLOUDINARY CONFIGURATION
// ==========================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// ==========================================
// MULTER + CLOUDINARY STORAGE
// ==========================================

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: {
        folder: "foodtech/restaurant-groups",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ],

        transformation: [
            {
                width: 1000,
                height: 1000,
                crop: "limit"
            }
        ]
    }
});


// Multer configuration
const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});


// ==========================================
// ADD RESTAURANT GROUP
// ==========================================

const addRGroup = async (req, res) => {

    try {

        const {
            RGroupName,
            area,
            category,
            region,
            offer
        } = req.body;


        // Check vendor
        const vendor = await Vendor.findById(req.vendorId);

        if (!vendor) {
            return res.status(404).json({
                error: "Vendor not found"
            });
        }


        // Cloudinary image URL
        const image = req.file
            ? req.file.path
            : undefined;


        // Create Restaurant Group
        const rgroup = new RGroup({

            RGroupName,
            area,
            category,
            region,
            offer,

            image,

            vendor: vendor._id
        });


        // Save restaurant group
        const savedRGroup = await rgroup.save();


        // Add only ID to vendor
        vendor.RGroup.push(savedRGroup._id);

        await vendor.save();


        return res.status(201).json({

            message: "Restaurant group added successfully",

            RGroupid: savedRGroup._id,

            image: image

        });

    } catch (error) {

        console.error("ADD RGROUP ERROR:", error);

        return res.status(500).json({

            error: "Internal server error",

            message: error.message

        });
    }
};


// ==========================================
// DELETE RESTAURANT GROUP
// ==========================================

const deleteRGroup = async (req, res) => {

    try {

        const rgid = req.params.rgid;


        // Find restaurant group
        const rgroup = await RGroup.findById(rgid);


        if (!rgroup) {

            return res.status(404).json({

                error: "Restaurant group not found"

            });
        }


        // Delete all products
        // belonging to this restaurant group
        await Product.deleteMany({
            RGroup: rgid
        });


        // Remove restaurant group
        // from vendor
        await Vendor.findByIdAndUpdate(

            rgroup.vendor,

            {
                $pull: {
                    RGroup: rgid
                }
            }

        );


        // Delete restaurant group
        await RGroup.findByIdAndDelete(rgid);


        return res.status(200).json({

            message: "Restaurant group deleted successfully"

        });

    } catch (error) {

        console.error("DELETE RGROUP ERROR:", error);

        return res.status(500).json({

            error: "Internal server error",

            message: error.message

        });
    }
};


// ==========================================
// MULTER ERROR HANDLER
// ==========================================

const uploadRGroupImage = (req, res, next) => {

    upload.single("image")(req, res, function (error) {

        if (error) {

            console.error("IMAGE UPLOAD ERROR:", error);

            return res.status(500).json({

                error: "Image upload failed",

                message: error.message

            });
        }

        next();

    });
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    addRGroup: [
        uploadRGroupImage,
        addRGroup
    ],

    deleteRGroup

};