const mongoose = require('mongoose');
const { Schema } = mongoose;

const optionSchema = new Schema({
    text: String,
});

const questionSchema = new Schema({
    title: String,
    question: String,
    options: [optionSchema],
    answer: Number,
});

const subjectSchema = new Schema({
    subject: String,
    questions: [questionSchema],
});

const quizstore = mongoose.model('Subjects', subjectSchema, 'subjects');

module.exports = quizstore;
