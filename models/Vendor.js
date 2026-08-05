const mongoose = require('mongoose');
const RGroup = require('./RestaurantGroup');

const vendorschema =new mongoose.Schema(
    {
        username:{
            type:String,
            required: true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        RGroup:[
            {
                type:mongoose.Schema.ObjectId,
                ref:'RGroup'
            }
        ]
    }
)

const Vendor = mongoose.model('Vendor',vendorschema);

module.exports = Vendor;