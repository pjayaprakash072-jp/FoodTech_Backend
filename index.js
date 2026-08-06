const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const vendorRoutes = require('./routes/vendorRoutes')
const rgroupRoutes = require('./routes/rgroupRoutes')
const productRoutes = require('./routes/productRoutes')
// const bodyParser = require('body-parser')
const path = require('path')

const app = express();

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("mongodb connected successfully!")
    })
    .catch((err) => {
        console.log("Error : ", err)
    })

// Middleware to parse JSON data
app.use(express.json());

// Alternatively, body-parser can also be used
// app.use(bodyParser.json())

// Vendor routes
app.use('/vendor', vendorRoutes);

// Restaurant Group routes
app.use('/rgroup', rgroupRoutes);
app.use('/product',productRoutes)

app.use('/uploads',express.static('uploads'))

// Start the server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})

// Home route
app.get('/home', (req, res) => {
    res.send("welcome to user")
})

// Default route
app.get('/', (req, res) => {
    res.send("<h1> welcome to Foodtech </h1>")
})