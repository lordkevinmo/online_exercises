const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*One question COULD be used by many exercises*/

const QuestionSchema = new Schema({
        Name: {type: String, required: true},
        Description: {type: String},
        Owner:{type: String, required: true}, //creator of the question
        IsDraft: {type: Boolean, default:true}, //Is the question finish to be created
        IsTemplate: {type: Boolean}, //Is this question a template to demonstrate functionality (public)
        Inputs: {type: Array},
        Instruction: {type: String}, //Example Multiply #A by #B.
        Function: {type: String}, //Contain the function
        OutputType: {type:String}, //Example : "Integer"
        MarginError: {type:Number}, //Example 4%
});


const Question = mongoose.model('Question',QuestionSchema);

module.exports = Question;
