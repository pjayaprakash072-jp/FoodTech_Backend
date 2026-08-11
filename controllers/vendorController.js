const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require("dotenv");

const Product = require("../models/Product");
const RGroup = require("../models/RestaurantGroup");

const sendEmail = require("../utils/sendEmail");

dotEnv.config();


// =====================================================
// JWT SECRET
// =====================================================

const secretkey = process.env.WhatIsYourName;


// =====================================================
// VENDOR REGISTRATION
// =====================================================

const vendorRegister = async (req, res) => {

    const {
        username,
        email,
        password
    } = req.body;


    try {

        // Check whether vendor already exists

        const vendorEmail =
            await Vendor.findOne({ email });


        if (vendorEmail) {

            return res.status(409).json({
                error: "Vendor already exists"
            });

        }


        // Hash password

        const hashPassword =
            await bcrypt.hash(password, 10);


        // Create vendor

        const newVendor = new Vendor({
            username,
            email,
            password: hashPassword
        });


        await newVendor.save();


        // Send welcome email

        try {

            await sendEmail(
                email,
                "Welcome to FoodTech",
                "Your FoodTech account has been successfully created."
            );

            console.log(
                "Welcome email sent successfully"
            );

        } catch (emailError) {

            // Registration should still succeed
            // even if email fails

            console.log(
                "Email sending failed:",
                emailError
            );

        }


        return res.status(201).json({
            message: "Vendor registered successfully"
        });


    } catch (error) {

        console.log(
            "Registration error:",
            error
        );

        return res.status(500).json({
            error: "Internal server error"
        });

    }
};



// =====================================================
// VENDOR LOGIN
// =====================================================

const vendorLogin = async (req, res) => {

    const {
        email,
        password
    } = req.body;


    try {

        // Find vendor

        const vendor =
            await Vendor.findOne({ email });


        // Check vendor and password

        if (
            !vendor ||
            !(await bcrypt.compare(
                password,
                vendor.password
            ))
        ) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // =================================================
        // CREATE JWT
        // =================================================

        const token = jwt.sign(
            {
                vendorId: vendor._id
            },
            secretkey,
            {
                expiresIn: "1h"
            }
        );


        // =================================================
        // LOGIN RESPONSE
        // =================================================

        // IMPORTANT:
        // We are NOT sending firstrgid anymore.
        //
        // The frontend will get ALL restaurants using:
        //
        // GET /vendor/restaurants
        //
        // and the vendor will select one.

        return res.status(200).json({

            message:
                "Vendor login successfully",

            token,

            vendorname:
                vendor.username,

            vendorid:
                vendor._id
        });


    } catch (error) {

        console.log(
            "Login error:",
            error
        );

        return res.status(500).json({
            error: "Internal server error"
        });

    }
};



// =====================================================
// GET ALL RESTAURANTS OF LOGGED-IN VENDOR
// =====================================================

const getVendorRestaurants = async (req, res) => {

    try {

        // req.vendorId is created by verifyToken middleware

        const vendor =
            await Vendor
                .findById(req.vendorId)
                .populate("RGroup");


        if (!vendor) {

            return res.status(404).json({
                error: "Vendor not found"
            });

        }


        return res.status(200).json({

            restaurants:
                vendor.RGroup

        });


    } catch (error) {

        console.log(
            "Get vendor restaurants error:",
            error
        );

        return res.status(500).json({
            error: "Internal server error"
        });

    }
};



// =====================================================
// GET ALL VENDORS
// =====================================================

const getallVendors = async (req, res) => {

    try {

        const vendors =
            await Vendor
                .find()
                .populate("RGroup");


        return res.status(200).json({
            vendors
        });


    } catch (error) {

        console.log(
            "Get all vendors error:",
            error
        );

        return res.status(500).json({
            error: "Internal server error"
        });

    }
};



// =====================================================
// GET SINGLE VENDOR
// =====================================================

const singleVendor = async (req, res) => {

    const vendorid =
        req.params.id;


    try {

        const vendor =
            await Vendor.findById(vendorid);


        if (!vendor) {

            return res.status(404).json({
                error: "Vendor not found"
            });

        }


        return res.status(200).json({
            vendor
        });


    } catch (error) {

        console.log(
            "Single vendor error:",
            error
        );

        return res.status(500).json({
            error: "Internal server error"
        });

    }
};



// =====================================================
// DELETE VENDOR
// =====================================================

const deleteVendor = async (req, res) => {

    try {

        const vendorid =
            req.params.id;


        // Find vendor

        const vendor =
            await Vendor.findById(vendorid);


        if (!vendor) {

            return res.status(404).json({
                error: "Vendor not found"
            });

        }


        // =================================================
        // DELETE ALL PRODUCTS
        // BELONGING TO VENDOR RESTAURANTS
        // =================================================

        await Product.deleteMany({
            RGroup: {
                $in: vendor.RGroup
            }
        });


        // =================================================
        // DELETE ALL RESTAURANTS
        // =================================================

        await RGroup.deleteMany({
            _id: {
                $in: vendor.RGroup
            }
        });


        // =================================================
        // DELETE VENDOR
        // =================================================

        await Vendor.findByIdAndDelete(
            vendorid
        );


        return res.status(200).json({

            message:
                "Vendor deleted successfully"

        });


    } catch (error) {

        console.log(
            "Delete vendor error:",
            error
        );

        return res.status(500).json({
            error: "Internal server error"
        });

    }
};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    vendorRegister,

    vendorLogin,

    getVendorRestaurants,

    getallVendors,

    singleVendor,

    deleteVendor

};