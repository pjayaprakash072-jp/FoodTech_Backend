const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        productName:{
            type:String,
            required :true
        },
        price:{
            type:String,
            required:true
        },
        category: {
            type: [
                {
                    type: String,
                    enum: ['veg', 'non-veg']
                }
            ]
        },
        image:{
            type:String
        },
        bestSeller:{
            type:Boolean
        },
        description:{
            type:String
        },
        RGroup: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'RGroup' // References the RGroup collection
            }
        ]
    }
)

const Product = mongoose.model('Product',productSchema)

module.exports = Product