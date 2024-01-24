require('dotenv').config();
const mongoose = require('mongoose')
const DBURL = process.env.DB_CONNECTION;

mongoose.connect(DBURL).then(()=>{
    console.log("database connected")
}).catch((err)=>{
    console.log(err)
})