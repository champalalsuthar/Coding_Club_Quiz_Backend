const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    quizid: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    quizTitle: {
        type: String,
        require: true
    },
    score: {
        type: Number,
        require: true
    },
    numberOfQuestions: {
        type: Number,
        require: true
    }

})

const UserResult = mongoose.model("UserResult", userSchema);
module.exports = UserResult