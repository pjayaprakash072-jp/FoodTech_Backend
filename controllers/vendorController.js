const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv')

dotEnv.config();

const secretkey = process.env.WhatIsYourName;

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


const vendorLogin = async(req,res)=>{
    const{email, password} = req.body;

    try{
        
        const vendor = await Vendor.findOne({email})
        if(!vendor || !(await bcrypt.compare(password, vendor.password))){
            return res.status(401).json({message: "Invalid username or password"})
        }

        // token generation.
        const token = jwt.sign(
            {
                vendorId : vendor._id
            },
            secretkey,
            {expiresIn : "1h"} // optional
        )



        res.status(200).json({message: "vendor login successfully", token})
        console.log(email)
    }catch(err){
        res.status(500).json({error: "Internal server error"})
        console.log("Error", err)
    }
}
module.exports = {vendorRegister ,vendorLogin}