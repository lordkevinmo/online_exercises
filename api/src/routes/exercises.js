const router = require('express').Router();
const auth = require('../middleware/auth');

const Exercise = require('../models/Exercise.model');
const Group = require('../models/Group.model');
const ExerciseSession = require('../models/ExerciseSession.model');

//Get all the question created by the user
router.route('/').get(auth,(req,res)=> {
    const userId = req.cookies['userId'] || req.query.userId;

    Exercise.find({owner:userId},{name:1,description:1,groupId:1,owner:1})
        .then(output => {
            res.json(output);
        })
        .catch(err => {
            res.status(400).json('Error: ' + err);
        })

});

//The owner of an exercise can request it directly from its Id
router.route('/:id').get(auth,(req,res)=> {
    const userId = req.cookies['userId'] || req.query.userId;

    Exercise.findOne({_id:req.params.id,owner:userId})
        .then((response) => {
            if(response === null)
            {
                res.status(400).json("Cannot access this exercises");
                return;
            }
            else
            {
                res.json(response);
            }
        })
        .catch((err) => {
            res.status(500).json("Error: " + err);
        })
});

//Any registered user can create an exercise
router.route('/create').post(auth,(req,res)=> {
    const userId = req.cookies['userId'] || req.query.userId;

    const exercise = new Exercise({
        name: req.body.Name,
        description: req.body.Description,
        owner:userId
    });

    exercise.save().then(
        (output) => {
            res.status(201).json({
                message: 'Exercise created',
                id:output._id
            });
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
});

//Any user can update an exercise that he belongs //TODO: CHECK THE ADDED QUESTION BELONG TO THE USER/
router.route('/update/:id').post(auth,(req,res)=> {

    const userId = req.cookies['userId'] || req.query.userId;

    const exercise = req.body;

    Exercise.updateOne({_id: req.params.id, owner: userId}, {name:exercise.name,description:exercise.description,questions:exercise.questions})
        .then(() => {
            res.json("Done");
        })
        .catch((err) => {
            res.status(500).json("Error: " + err);
        });
});

//Any user who own an exercise can assign to a group where he is admin
router.route('/assign').post(auth,(req,res)=> {

    const userId = req.cookies['userId'] || req.query.userId;
    const exerciseId = req.body.exerciseId;
    const groupId = req.body.groupId;

    //console.log('exerciseId:' + exerciseId);
    //console.log('groupId:' + groupId);

    //First we check that the userId is an ADMIN of the group
    //SECOND we check that the userId own the exercise
    Exercise.findById(exerciseId)
        .then((exercise => {

            if(exercise.owner===userId)
            {
                Group.updateOne({_id:groupId,admin:userId},{$push:{exercises:exerciseId}})
                    .then((elem) => {
                        //console.log(elem);
                        res.json('Done');
                    })
                    .catch(err => {
                        res.json('Error: ' + err);
                    })
            }
            else
            {
                res.status(400).json('Error userId not owner of exercise');
            }

        }))
        .catch((err) =>  {
            res.json('Error: ' + err);
        });

});

//Any user can update his result in his own userSession in an exercise in a specific group
router.route('/attend/update').post(auth,(req,res)=> {

    const userId = req.cookies['userId'] || req.query.userId;
    const exerciseSessionID = req.body.exerciseSessionID;
    const UserOutput = req.body.UserOutput;
    const groupId = req.body.groupId;

    ExerciseSession.findOneAndUpdate({_id:exerciseSessionID,userId:userId,groupId:groupId,submitted:false},{UserOutput:UserOutput})
        .then((out) => {
            if(out !== undefined)
                res.json('Updated');
            else
                res.json('Error session not found');
        })
        .catch((err) => {
            res.json('Error: ' + err);
        });

});


router.route('/attend/submit').post(auth,(req,res)=> {

    const userId = req.cookies['userId'] || req.query.userId;
    const exerciseSessionID = req.body.exerciseSessionID;
    const UserOutput = req.body.UserOutput;
    const groupId = req.body.groupId;

    console.log(UserOutput);

    ExerciseSession.findOneAndUpdate({
        _id:exerciseSessionID,
        userId:userId,
        groupId:groupId,
        submitted:false},{UserOutput:UserOutput,submitted:true},{new:true})
        .then((out) => {
            if(out === undefined)
                res.json("Error cannot found exerciseSession");
            else
            {
                console.log(out);
                res.json(verifyUserOutput(out));
            }
        })
        .catch((err) => {
            res.json('Error: ' + err);
        });

});


//Any user can attend to exercise available to group where he is IN (admin or not)
router.route('/attend').post(auth,(req,res)=> {

    const userId = req.cookies['userId'] || req.query.userId;

    const exerciseId = req.body.exerciseId;
    const groupId = req.body.groupId;

    Group.findOne({_id:groupId, $or: [{users:userId},{admin:userId}],exercises:exerciseId})
        .then(group => {
            if(group)
            {
                //WARNING: NEVER SEND THE OUTPUT TO THE USER!
                ExerciseSession.findOne({userId:userId,exerciseId:exerciseId,groupId:groupId},{'questionLogs.output':0,'questionLogs.logs':0})
                    .then(exerciseSession => {
                        //Creating the session
                        if(exerciseSession == null)
                        {
                            const exerciseSession = new ExerciseSession({userId:userId,startTime:new Date(),exerciseId:exerciseId,groupId:groupId});

                            exerciseSession.save()
                                .then((session) => {

                                    //Sending the new session created + generating the inputs/output for each question + the question(Name, Description, Instruction)
                                    getQuestions(exerciseId,res,session,true); //=> We need to generate the questions inputs/outputs and save them into the session

                                })
                                .catch(err => {
                                    res.json('Error: ' + err);
                                })
                        }
                        else
                        {
                            //If user ALREADY submitted for this and try to make it again give error
                            if(exerciseSession.submitted) {
                                res.json({error:true,msg:'You already submitted for this exercise in this group'});
                            }
                            else {
                                //Sending the current session + the question(Name, Description, Instruction)
                                getQuestions(exerciseId,res,exerciseSession,false);
                            }
                        }

                    })
                    .catch(err => {
                        res.json('Error: ' + err)
                    });

            }
            else
            {
                res.json('Group or exercise not accessible');
            }

        })
        .catch(err => {
            res.json('Error: ' + err);
        })

});

//isGenerateNeeded mean that we need to create the inputs/output for each question AND save them into exerciseSession
function getQuestions(exerciseId,res,exerciseSession,isGenerateNeeded)
{
    const mongoose = require('mongoose');
    const ObjectId = mongoose.Types.ObjectId;

    Exercise.aggregate([
        {
            $match: { _id: ObjectId(exerciseId) }
        },
        {
            $project: {
                questions: {
                    $map: {
                        input: "$questions.id",
                        as: "item1",
                        in: {
                            $toObjectId: "$$item1"
                        }
                    }
                },
                name:1,
                description:1
            }
        },
        {
            '$lookup': {
                'from': "questions",
                'localField': "questions",
                'foreignField': "_id",
                'as': "questions"
            }
        }

    ])
        .exec((err, result)=>{
            if (err) {
                res.status(500).json(err);
            }
            if (result) {

                if(result.length===0)
                    res.status(400).json("Error: can't found data");
                else
                {
                    if(isGenerateNeeded)
                    {
                        ExerciseSession.findByIdAndUpdate(
                            exerciseSession._id,
                            {questionLogs:generateQuestions(result[0].questions)},
                            {projection:{'questionLogs.output':0,'questionLogs.logs':0} ,new:true}
                            )
                            .then((session) => {

                                res.json({session:session,questions:extractReleventInformationQuestion(result[0].questions),exercise:result[0].name});
                            })
                            .catch(err => {
                                res.json('Error: ' + err);
                            })
                    }
                    else
                    {
                        res.json({session:exerciseSession,questions:extractReleventInformationQuestion(result[0].questions),exercise:result[0].name});
                    }


                }
            }
        });
}

function generateQuestions(questions)
{
    const Utils = require('./../Utils');

    let questionsArray = [];
    questions.forEach((question) => {
        questionsArray.push(Utils.execute(question.Inputs,question.Function,false)) //TODO: isMathIncluded
    });
    return questionsArray;
}

function extractReleventInformationQuestion(questions)
{
    let questionsArray = [];
    questions.forEach((question) => {

        let inputs = [];
        question.Inputs.forEach(input => {
           inputs.push({name:input.name,index:input.index})
        });

        questionsArray.push({Name:question.Name,Description:question.Description, Instruction:question.Instruction,Inputs:inputs})
    });
    return questionsArray;
}

function verifyUserOutput(exerciseSession)
{
    const UserOutput = exerciseSession.UserOutput;
    let results = [];
    let points = 0;
    exerciseSession.questionLogs.forEach((item,index) => {
        if(item.output + '' ===  UserOutput[index] + '') //We convert into string to avoid bugs of comparing string with number
        {
            results.push({correct:true});
            points++;
        }
        else
            results.push({correct:false,expected:item.output + '',given:UserOutput[index] + ''});
    });
    return {details:results,points:points};
}
module.exports = router;
