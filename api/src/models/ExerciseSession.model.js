const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExerciseSessionSchema = new Schema({
        userId: {type: String, required:true},
        startTime:{type: Date},
        groupId: {type: String, required:true},
        exerciseId: {type: String, required:true},
        questionLogs: {type: Array}, //Inputs / outputs
        UserOutput: {type: Array,default: undefined},
        submitted:{type: Boolean, default: false},
});

const Exercise = mongoose.model('ExerciseSession',ExerciseSessionSchema);

module.exports = Exercise;
