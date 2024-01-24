const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        require:true
    }
    ,
    Lastname:{
        type:String,
        require:true
    },

    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

const user = mongoose.model("user",userSchema);
module.exports = user