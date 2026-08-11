const mongoose = require("mongoose");


const RGroupSchema = new mongoose.Schema(
    {

        // ==========================================
        // RESTAURANT NAME
        // ==========================================

        RGroupName: {
            type: String,
            required: true,
            unique: true
        },


        // ==========================================
        // AREA
        // ==========================================

        area: {
            type: String,
            required: true
        },


        // ==========================================
        // FOOD CATEGORY
        // ==========================================

        category: [
            {
                type: String,
                enum: ["veg", "non-veg"]
            }
        ],


        // ==========================================
        // CUISINE / REGION
        // ==========================================

        region: [
            {
                type: String,
                enum: [
                    "Bakery",
                    "Fast Food",
                    "Italian",
                    "Chinese",
                    "Indian",
                    "Desserts"
                ]
            }
        ],


        // ==========================================
        // OFFER
        // ==========================================

        offer: {
            type: String
        },


        // ==========================================
        // RESTAURANT IMAGE
        // ==========================================

        image: {
            type: String
        },


        // ==========================================
        // OWNER VENDOR
        // ==========================================

        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true
        },


        // ==========================================
        // PRODUCTS
        // ==========================================

        Products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ]

    },

    {
        timestamps: true
    }
);


const RGroup = mongoose.model(
    "RGroup",
    RGroupSchema
);


module.exports = RGroup;