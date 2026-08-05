const Vendor = require('../models/Vendor')
const jwt = require('jsonwebtoken')
const dotEnv = require('dotenv')

dotEnv.config();

// Secret key used to verify JWT token
const secretekey = process.env.WhatIsYourName;

// Middleware to verify the vendor's token
const verifyToken = async (req, res, next) => {

    // Get token from request headers
    const token = req.headers.token;

    // Check if token is provided
    if (!token) {
        return res.status(400).json({ error: "Token is required" })
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, secretekey);

        // Find the vendor using the decoded vendorId
        const vendor = await Vendor.findById(decoded.vendorId);

        // Store vendor ID in the request object for later use
        req.vendorId = vendor._id;

        // Move to the next middleware/controller
        next();

    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = verifyToken;