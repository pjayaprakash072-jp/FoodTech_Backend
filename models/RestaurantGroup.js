const mongoose = require('mongoose')

const RGroupSchema = new mongoose.Schema(
    {
        RGroupName:{
            type:String,
            required:true,
            unique:true
        },
        area:{
            type:String,
            required:true
        },
        category:{
            type:[
                {
                    type:String,
                    enum:['veg','non-veg']

                }
            ]
        },
        region:{
            type:[
                {
                    type:String,
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
        offer:{
            type:String
        },
        vendor:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'vendor'
            }
        ]
    }
)

const RGroup = mongoose.model('RGroup',RGroupSchema);

module.exports = RGroup;