const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    Questions: {
        type: Array,
        require: true
    },
    userfullname: {
        type: String,
        require: true
    },
    userid: {
        type: String,
        require: true
    }

})

const quizstore = mongoose.model('quizsstore', quizSchema);
module.exports = quizstore;


// const mongoose = require('mongoose');

// const quizSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     questions: [
//         {
//             question: {
//                 type: String,
//                 required: true
//             },
//             option1: {
//                 type: String,
//                 required: true
//             },
//             option2: {
//                 type: String,
//                 required: true
//             },
//             option3: {
//                 type: String,
//                 required: true
//             },
//             option4: {
//                 type: String,
//                 required: true
//             },
//             ans: {
//                 type: String,
//                 required: true
//             }
//         }
//     ]
// });

// const quizstore = mongoose.model('quizstore', quizSchema);
// module.exports = quizstore;
