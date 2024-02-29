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

const u1 = mongoose.model("subjecttemp",userSchema,"subjecttemp");
module.exports = u1