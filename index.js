const express = require('express') 
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const vendorRoutes = require('./routes/vendorRoutes')
const rgroupRoutes = require('./routes/rgroupRoutes')
// const bodyParser = require('body-parser')


const app = express();

dotenv.config()
const port = process.env.PORT

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("mongodb connected successfully!")
    })
    .catch((err)=>{
        console.log("Error : " , err)
    })

    app.use(express.json())
    // in the same way we can use body-parser to allow json
    // app.use(bodyParser.json())
// middleware for vendor Routes
    app.use('/vendor',vendorRoutes)
    app.use('/rgroup',rgroupRoutes  )





app.listen(port , ()=>{
    console.log(`Server is running at port ${port}`);
})

app.get('/home', (req,res)=>{
    res.send("welcome to user")
})
app.get('/', (req,res)=>{
    res.send("<h1> welcome to Foodtech </h1>")
})