const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv')
const Product = require('../models/Product')
const RGroup = require('../models/RestaurantGroup')

dotEnv.config();

// Secret key used for JWT token generation
const secretkey = process.env.WhatIsYourName;

// Vendor Registration
const vendorRegister = async (req, res) => {

    // Get user details from request body
    const { username, email, password } = req.body;

    try {

        // Check if the email already exists
        const vendorEmail = await Vendor.findOne({ email });

        if (vendorEmail) {
            return res.status(409).json("Vendor already exists");
        }

        // Encrypt the password before storing it
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new vendor document
        const newVendor = Vendor({
            username,
            email,
            password: hashPassword
        });

        // Save vendor to the database
        await newVendor.save();

        res.status(201).json({ message: "vendor registered successfully" });
        console.log("vendor registered successfully");

    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error", err);
    }
}

// Vendor Login
const vendorLogin = async (req, res) => {

    // Get login credentials
    const { email, password } = req.body;

    try {

        // Find vendor by email
        const vendor = await Vendor.findOne({ email });

        // Check if vendor exists and password is correct
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                vendorId: vendor._id
            },
            secretkey,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Send success response with token
        const firstrgid = vendor.RGroup[0];
        const vendorname = vendor.username;
        const vendorid = vendor._id;
        res.status(200).json({
            message: "vendor login successfully",
            token,
            vendorname,
            firstrgid,
            vendorid
        });

        console.log(email);

    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error", err);
    }
}

const getallVendors = async (req,res)=>{

    try {
        
        const vendors = await Vendor.find().populate("RGroup");
        res.status(200).json({vendors});
    } catch (error) {
        res.status(500).json({error: "Internalserver error"});
        console.log("Error", error)
    }
}

// retrieving a single vendor by id

const singleVendor = async (req, res)=>{

    const vendorid = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorid)
        // const vendor = await Vendor.findById(vendorid).populate('RGroup') //-  to get restaurant groups also
        if(!vendor){
            res.status(404).json({error: "vendor not found"})
        }
        res.status(200).json({vendor})
    } catch (error) {
        res.status(500).json({error: "Internalserver error"});
        console.log("Error", error)
    }
}
//  OPTIONAL OF DELETING the VENDOR WITH ALL HIS/HER RGROUPS , PORDUCTS....
// const RGroup = require('../models/RestaurantGroup');
// const Product = require('../models/Product');

const deleteVendor = async (req, res) => {
    try {

        const vendorid = req.params.id;

        // Find the vendor
        const vendor = await Vendor.findById(vendorid);

        if (!vendor) {
            return res.status(404).json({
                error: "Vendor not found"
            });
        }

        // Delete all products belonging to the vendor's restaurant groups
        await Product.deleteMany({
            RGroup: { $in: vendor.RGroup }
        });

        // Delete all restaurant groups of the vendor
        await RGroup.deleteMany({
            _id: { $in: vendor.RGroup }
        });

        // Delete the vendor
        await Vendor.findByIdAndDelete(vendorid);

        res.status(204).json({
            message: "Vendor deleted successfully"
        });

    } catch (error) {
        console.log("Error", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};
module.exports = { vendorRegister, vendorLogin ,getallVendors ,singleVendor,deleteVendor};