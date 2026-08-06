const mongoose = require('mongoose');
const RGroup = require('./RestaurantGroup');
const Product = require('./Product');

const vendorschema = new mongoose.Schema(
    {
        // Vendor username
        username: {
            type: String,
            required: true
        },

        // Vendor email (must be unique)
        email: {
            type: String,
            required: true,
            unique: true
        },

        // Vendor password
        password: {
            type: String,
            required: true
        },

        // Stores the IDs of Restaurant Groups owned by this vendor
        RGroup: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'RGroup' // References the RGroup collection
            }
        ]
        // ,
        // Products: [
        //     {
        //         type: mongoose.Schema.ObjectId,
        //         ref: 'Product' // References the RGroup collection
        //     }
        // ]
    }
)

const Vendor = mongoose.model('Vendor', vendorschema);

// Export the Vendor model
module.exports = Vendor;