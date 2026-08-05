const mongoose = require('mongoose')

const vendorschema = mongoose.Schema(
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
        }
    }
)

const Vendor = mongoose.model('Vendor',vendorschema);

module.exports = Vendor;