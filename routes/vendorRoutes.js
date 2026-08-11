const vendorController = require("../controllers/vendorController");
const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");


// ==========================================
// VENDOR REGISTRATION
// ==========================================

router.post(
    "/register",
    vendorController.vendorRegister
);


// ==========================================
// VENDOR LOGIN
// ==========================================

router.post(
    "/login",
    vendorController.vendorLogin
);


// ==========================================
// GET ALL RESTAURANTS OF LOGGED-IN VENDOR
// ==========================================

router.get(
    "/restaurants",
    verifyToken,
    vendorController.getVendorRestaurants
);


// ==========================================
// GET ALL VENDORS
// ==========================================

router.get(
    "/all-vendors",
    vendorController.getallVendors
);


// ==========================================
// GET SINGLE VENDOR
// ==========================================

router.get(
    "/single-vendor/:id",
    vendorController.singleVendor
);


// ==========================================
// DELETE VENDOR
// ==========================================

router.delete(
    "/delete/:id",
    vendorController.deleteVendor
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;