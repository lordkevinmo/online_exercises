const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
        groupId: {type: String}, //[{userId:"",randomToken:""},..] //Only the student who attempted to this exercise will be in this array
        owner:{type: String},
        questions: {type: Array}, //["questionId",..]
        timeLimit: {type: Number}, //Express in minutes
        startTime: {type: Date, default:undefined}, //We can know from this if the exam is finish or not or didn't start
        name:{type: String},
        description: {type: String},
});

const Exercise = mongoose.model('Exercise',ExerciseSchema);

module.exports = Exercise;
