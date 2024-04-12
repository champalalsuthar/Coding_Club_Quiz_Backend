const mongoose = require('mongoose')

const feedbackschema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
    ,
    email: {
        type: email,
        require: true
    },
    message: {
        type: String,
        require: true
    },

})

const feedback = mongoose.model("feedback", feedbackschema);
module.exports = feedback