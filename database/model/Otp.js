const mongoose = require('mongoose');

const Otp = new mongoose.Schema({
    Email:{
        type:String,
        required:true
    },
    OTP:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60 * 5
    }
})
 const otp=mongoose.model('otp' , Otp)

module.exports = otp