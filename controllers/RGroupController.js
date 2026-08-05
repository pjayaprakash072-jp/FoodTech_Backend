const RGroup = require('../models/RestaurantGroup')
const Vendor = require('../models/Vendor')

const addRGroup = async (req,res)=>{
    const {RGroupName, area, category, region, offer,image} = req.body;
    const vendor = await Vendor.findById(req.vendorId)
}