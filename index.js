const express = require('express') 
const dotenv = require('dotenv')
const mongoose = require('mongoose')


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

app.listen(port , ()=>{
    console.log(`Server is running at port ${port}`);
})

app.get('/home', (req,res)=>{
    res.send("welcome to user")
})
app.get('/', (req,res)=>{
    res.send("<h1> welcome to Foodtech </h1>")
})