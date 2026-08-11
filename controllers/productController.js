const Product = require("../models/Product");
const RGroup = require("../models/RestaurantGroup");

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
        folder: "foodtech/products",

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


// ==========================================
// MULTER CONFIGURATION
// ==========================================

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});


// ==========================================
// ADD PRODUCT
// ==========================================

const addProduct = async (req, res) => {

    try {

        const rgid = req.params.rgid;

        const {
            productName,
            price,
            category,
            bestSeller,
            description
        } = req.body;


        // ==========================================
        // FIND RESTAURANT GROUP
        // ==========================================

        const rgroup = await RGroup.findById(rgid);

        if (!rgroup) {

            return res.status(404).json({
                error: "Restaurant group is not found"
            });
        }


        // ==========================================
        // CLOUDINARY IMAGE
        // ==========================================

        const image = req.file
            ? req.file.path
            : undefined;


        const imagePublicId = req.file
            ? req.file.filename
            : undefined;


        // ==========================================
        // CREATE PRODUCT
        // ==========================================

        const product = new Product({

            productName,

            price,

            category,

            bestSeller,

            description,

            image,

            imagePublicId,

            RGroup: rgroup._id

        });


        // ==========================================
        // SAVE PRODUCT
        // ==========================================

        const savedProduct = await product.save();


        // ==========================================
        // ADD PRODUCT ID TO RESTAURANT GROUP
        // ==========================================

        rgroup.Products.push(savedProduct._id);

        await rgroup.save();


        return res.status(201).json({

            message: "Product added successfully",

            productId: savedProduct._id,

            image: image

        });

    } catch (error) {

        console.error("ADD PRODUCT ERROR:", error);

        return res.status(500).json({

            error: "Internal server error",

            message: error.message

        });
    }
};


// ==========================================
// GET PRODUCTS BY RESTAURANT GROUP
// ==========================================

const getProductByRGroup = async (req, res) => {

    try {

        const rgid = req.params.rgid;


        // Find restaurant group
        const rgroup = await RGroup.findById(rgid);

        if (!rgroup) {

            return res.status(404).json({

                error: "Restaurant group is not found"

            });
        }


        const restaurantName = rgroup.RGroupName;


        // Find products
        const products = await Product.find({
            RGroup: rgid
        });


        return res.status(200).json({

            RestairamtName: restaurantName,

            products: products

        });

    } catch (error) {

        console.error("GET PRODUCTS ERROR:", error);

        return res.status(500).json({

            error: "Internal server error",

            message: error.message

        });
    }
};


// ==========================================
// DELETE PRODUCT
// ==========================================

const deleteProduct = async (req, res) => {

    try {

        const pid = req.params.pid;


        // ==========================================
        // FIND PRODUCT
        // ==========================================

        const product = await Product.findById(pid);

        if (!product) {

            return res.status(404).json({

                error: "No product found"

            });
        }


        // ==========================================
        // DELETE IMAGE FROM CLOUDINARY
        // ==========================================

        if (product.imagePublicId) {

            try {

                await cloudinary.uploader.destroy(
                    product.imagePublicId
                );

                console.log(
                    "Cloudinary image deleted:",
                    product.imagePublicId
                );

            } catch (cloudinaryError) {

                console.error(
                    "Cloudinary image deletion error:",
                    cloudinaryError
                );

                // Don't stop product deletion
                // if Cloudinary deletion fails
            }
        }


        // ==========================================
        // DELETE PRODUCT FROM MONGODB
        // ==========================================

        await Product.findByIdAndDelete(pid);


        // ==========================================
        // REMOVE PRODUCT FROM RESTAURANT GROUP
        // ==========================================

        await RGroup.findByIdAndUpdate(

            product.RGroup,

            {
                $pull: {
                    Products: pid
                }
            }

        );


        return res.status(200).json({

            message: "Product deleted successfully"

        });

    } catch (error) {

        console.error("DELETE PRODUCT ERROR:", error);

        return res.status(500).json({

            error: "Internal server error",

            message: error.message

        });
    }
};


// ==========================================
// CLOUDINARY / MULTER ERROR HANDLER
// ==========================================

const uploadProductImage = (req, res, next) => {

    upload.single("image")(req, res, function (error) {

        if (error) {

            console.error(
                "PRODUCT IMAGE UPLOAD ERROR:",
                error
            );

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

    addProduct: [
        uploadProductImage,
        addProduct
    ],

    getProductByRGroup,

    deleteProduct

};