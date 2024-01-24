const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://champalaljangid9292:champa123@cluster0.iwftirj.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("database connected")
}).catch((err)=>{
    console.log(err)
})