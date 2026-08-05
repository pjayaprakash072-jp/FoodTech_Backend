const vendor = require('../models/Vendor')
const jwt = require('jsonwebtoken')
const dotEnv = require('dotenv')

dotEnv.config();

const secretekey = process.env.WhatIsYourName;

const verifyToken = async(req,res,next)=>{
    const token = req.headers.token;

    if(!token){
        return res.status(400).json({error: "Token is required"})
    }

    try {
        const decoded = jwt.verify(token,secretekey);
        const vendor = await Vendor.findById(decoded.vendorId)
        req.vendorId = vendor._id// _id is added ot req obj because we are gettign vendor doc in RGroupController by this vendorId.
        next();
    } catch (error) {
        console.log("Error" , error);
        res.status(500).json({error:"Internal Server Error"})
    }
}

module.exports = verifyToken