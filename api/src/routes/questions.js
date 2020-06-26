const router = require('express').Router();
const auth = require('../middleware/auth');

const Question = require('../models/Question.model');
const ExerciseSession = require('../models/ExerciseSession.model');
const Exercise = require('../models/Exercise.model');

//Get all the question created by the user
router.route('/').get(auth,(req,res)=> {
    const userId = req.cookies['userId'] || req.query.userId;

    Question.find({Owner:userId},{Name:1,Description:1,IsDraft:1,IsTemplate:1})
        .then(output => {
            res.json(output);
        })
        .catch(err => {
            res.status(400).json('Error: ' + err);
        })

});

router.route('/create').post(auth,(req,res)=> {

    const userId = req.cookies['userId'] || req.query.userId;

    //TODO: create type of question ????!!!!

    const question = new Question({
        Name: req.body.Name,
        Description: req.body.Description,
        Owner:userId
    });

    question.save().then(
        (output) => {
            res.status(201).json({
                message: 'Question created',
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

router.route('/:id').get(auth,(req,res)=> {
    const userId = req.cookies['userId'] || req.query.userId;

    Question.findOne({_id:req.params.id,Owner:userId})
        .then((response) => {
            if(response === null)
            {
                res.status(400).json("Cannot access this question");
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

router.route('/update/:id').post(auth,(req,res)=> {

    const userId = req.cookies['userId'] || req.query.userId;

    Question.updateOne({_id: req.params.id, Owner: userId}, req.body)
        .then(() => {
            //After updated the question we need to delete every userSession

            Exercise.find({'questions.id': req.params.id},{_id:1})
                .then((exercises) => {

                    if(exercises === undefined || exercises.length === 0)
                    {
                        res.json({msg: 'Question updated without problem', exercisesUpdated:false});
                    }
                    else
                    {
                        let array_id = [];
                        exercises.forEach((item) => {
                            array_id.push(item._id);
                        });

                        ExerciseSession.deleteMany({exerciseId: {$in:array_id}, submitted:false})
                            .then((output) => {

                                if(output === undefined || output.deletedCount === 0 )
                                {
                                    res.json({msg: 'Question updated without problem',
                                        exercisesUpdated:true,
                                        sessionsDeleted: false});
                                }
                                else
                                {
                                    res.json({msg: output.deletedCount + ' sessions removed for the exercises containing this question',
                                        exercisesUpdated:true,
                                        sessionsDeleted: false});
                                }
                            })
                            .catch((err) => {
                                res.json({msg: 'Error: ' + err});
                            })
                    }

                })
                .catch((err) => {
                    res.json({msg: 'Error: ' + err});
                });

        })
        .catch((err) => {
            res.status(500).json("Error: " + err);
        });
});

router.route('/search/:val').get(auth,(req, res) => {

    const userId = req.cookies['userId'] || req.query.userId;

    const value = req.params.val;
    Question.find( {Name:{$regex:".*"+ value + ".*"} ,Owner: userId})
        .limit( 10 )
        .then((response) => {
            res.json(response);
        })
        .catch((err) => res.status(400).json("Error: " + err));

});


module.exports = router;
