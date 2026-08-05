const Vendor = require('../models/Vendor');
const jst = require('jsonwebtoken')
const bcrypt = require('bcryptjs');


const vendorRegister = async (req,res)=>{
    const {username, email , password} = req.body;

    try{
        const vendorEmail = await Vendor.findOne({email})

        if(vendorEmail){
            return res.status(400).json("email already exists");
        }

        const hashPassword = await bcrypt.hash(password,10);

        const newVendor = Vendor(
            {
                username,
                email,
                password : hashPassword
            }
        )

        await newVendor.save();
        res.status(200).json({message: "vendor registered successfully"});
        console.log("vendor registered successfully");


    }catch(err){
        res.status(500).json({error: "Internal server error"})
        console.log("Error", err)
    }

}

module.exports = {vendorRegister}