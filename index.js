const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const vendorRoutes = require("./routes/vendorRoutes");
const rgroupRoutes = require("./routes/rgroupRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Routes
app.use("/vendor", vendorRoutes);
app.use("/rgroup", rgroupRoutes);
app.use("/product", productRoutes);

// Home route
app.get("/home", (req, res) => {
    res.send("Welcome to user");
});

// Root route
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Foodtech By JAYAPRAKASH</h1>");
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});