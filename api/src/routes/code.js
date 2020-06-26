const router = require('express').Router();
const auth = require('../middleware/auth');

const Utils = require('./../../Utils');

const Question = require('../models/Question.model');

//This will be used to tag the input variables
const trigger = '@';


router.route('/execute').post(auth,(req,res)=> {

    let code = req.body.code;
    const inputs = req.body.inputs;
    const isMathIncluded = req.body.isMathIncluded;

    res.json(Utils.execute(inputs,code,isMathIncluded));

});

router.route('/simulate/:id').get(auth,(req,res)=> {
    const userId = req.cookies['userId'] || req.query.userId;

    Question.findOne({_id:req.params.id,Owner:userId})
        .then((question) => {

            const result = Utils.execute(question.Inputs,question.Function,false);
            //const instruction = generateInstruction(question.Inputs,question.Instruction,result)

            res.json({
                instruction:question.Instruction,
                values:result.input,
                inputs:question.Inputs,
                output:result.output,
                logs:result.log,
                message:"In a real exam the user will not receive the answer. Here it is a simulation"});

        })
        .catch(err => {
            res.json('Error: ' + err);
        })

});


module.exports = router;
