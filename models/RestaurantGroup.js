const mongoose = require('mongoose')

const RGroupSchema = new mongoose.Schema(
    {
        // Name of the restaurant group
        RGroupName: {
            type: String,
            required: true,
            unique: true
        },

        // Area where the restaurant group is located
        area: {
            type: String,
            required: true
        },

        // Food category (Veg or Non-Veg)
        category: {
            type: [
                {
                    type: String,
                    enum: ['veg', 'non-veg']
                }
            ]
        },

        // Cuisine types offered
        region: {
            type: [
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
            ]
        },

        // Special offer or discount
        offer: {
            type: String
        },

        // Restaurant image path or URL
        image: {
            type: String
        },

        // References the vendor(s) who own this restaurant group
        vendor: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'vendor'
            }
        ],
        Products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        ]
    }
    , {
    timestamps: true
});

const RGroup = mongoose.model('RGroup', RGroupSchema);

// Export the RGroup model
module.exports = RGroup;