const express = require('express') 
const dotenv = require('dotenv')


const app = express();

dotenv.config()
const port = process.env.PORT

app.listen(port , ()=>{
    console.log(`Server is running at port ${port}`);
})

app.get('/home', (req,res)=>{
    res.send("welcome to user")
})
app.get('/', (req,res)=>{
    res.send("<h1> welcome to Foodtech </h1>")
})