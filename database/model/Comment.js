// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userid: {
        type: String,
        require: true
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        // required: true
    },
    quizid: {
        type: String,
        require: true
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Quiz',
        // required: true
    },
    Comment: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    Lastname: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserComment = mongoose.model('UserComment', commentSchema);

module.exports = UserComment;
