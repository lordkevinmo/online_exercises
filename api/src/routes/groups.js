const router = require('express').Router();

/*Models*/
const Group = require('../models/Group.model');
const User = require('../models/User.model');

const auth = require('../middleware/auth');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


//Display user's group ONLY we can't give all the informations of each group.
router.route('/').get(auth,(req,res)=> {
    const userId = req.cookies['userId'] || req.query.userId;

    Group.find({ $or: [ {users:userId}, {admin:userId} ] },{name:1,description:1,_id:1})
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.status(500).json("Error: " + err);
        })
});

//Display information about the group only user or admin or the group can see those information
router.route('/:id').get(auth,(req,res)=> {
    const userId = req.cookies['userId'] || req.query.userId;

    Group.aggregate([
        {
            $match: {$or: [ {users:userId}, {admin:userId} ], _id:ObjectId(req.params.id)}
        },
        {
            $project: {
                name:1,
                description:1,
                users:1,
                admin:1,
                exercises: {
                    $map: {
                        input: "$exercises",
                        as: "item1",
                        in: {
                            $toObjectId: "$$item1"
                        }
                    }
                }
            }
        },
        {
            '$lookup': {
                'from': "exercises",
                'localField': "exercises",
                'foreignField': "_id",
                'as': "exercises"
            }
        },
        {
            $project: {
                name:1,
                description:1,
                users:1,
                admin:1,
                exercises:1,
                /*exercisesID: {
                    $map: {
                        input: "$exercises._id",
                        as: "item2",
                        in: {
                            $toString: "$$item2"
                        }
                    }
                }*/
            }
        }/*,
        {
            '$lookup': {
                'from': "exercisesessions",
                'localField': "exercisesID",
                'foreignField': "exerciseId",
                'as': "sessions"
            }
        },
        {
            $match: {$or:[{'sessions.userId':userId},{sessions:{ $exists: true}}]}
        },
        {
            $project: {
                name:1,
                description:1,
                users:1,
                admin:1,
                exercises: 1,
                'sessions.submitted':1,
            }
        }*/
    ])
        .exec((err, result)=>{
            if (err) {
                res.status(500).json(err);
            }
            if (result) {

                if(result.length===0)
                    res.status(400).json("Error: can't found data");
                else
                    res.status(200).json(result);
            }
        });


});

router.route('/create').post(auth,(req,res)=> {
    const userId = req.query.userId;

    const group = new Group({admin:[userId],name:req.body.name,description:req.body.description,isPublic:req.body.isPublic});

    group.save()
        .then((out) => {
            res.json({msg:"Created",_id:out._id});
        })
        .catch(err => {
            res.status(500).json('Error: ' + err);
        })
});

router.route('/join').post(auth,(req,res)=> {

    const userId = req.query.userId;


    Group.findOne({_id:req.body.GroupId, banned: {$nin: userId}, pending:{$nin: userId},users:{$nin: userId},admin:{$nin: userId}})
        .then((group) => {

            if(group===null)
            {
                res.status(400).json("Can't found/join group, You may be banned, already inside or still in pending list");
                return;
            }

            if(group.isPublic)
            {
                Group.updateOne({_id:group._id},{$push: {users:userId}})
                    .then(() => {
                        res.json('Added with success');
                    })
                    .catch((err) => {
                        res.status(400).json('Error: ' + err);
                    })
            }
            else
            {
                Group.updateOne({_id:group._id},{$push: {pending:userId}})
                    .then(() => {
                        res.json('Added with success');
                    })
                    .catch((err) => {
                        res.status(400).json('Error: ' + err);
                    })
            }

        })
        .catch(err => {
            res.status(400).json('Error: ' + err);
        })


});

//Display members's information of a group (Need to be admin of this group)
router.route('/members/:id').get(auth,(req,res)=> {
    const userId = req.cookies['userId'] || req.query.userId;

    Group.aggregate([
        {
            $match: { _id: ObjectId(req.params.id) , admin:userId}
        },
        {
            $project: {
                pending: {
                    $map: {
                        input: "$pending",
                        as: "item1",
                        in: {
                            $toObjectId: "$$item1"
                        }
                    }
                },
                members: {
                    $map: {
                        input: "$users",
                        as: "item2",
                        in: {
                            $toObjectId: "$$item2"
                        }
                    }
                },
                admins: {
                    $map: {
                        input: "$admin",
                        as: "item3",
                        in: {
                            $toObjectId: "$$item3"
                        }
                    }
                },
                banned: {
                    $map: {
                        input: "$banned",
                        as: "item4",
                        in: {
                            $toObjectId: "$$item4"
                        }
                    }
                }
            }
        },
        {
            '$lookup': {
                'from': "users",
                'localField': "pending",
                'foreignField': "_id",
                'as': "pending"
            }
        },
        {
            '$lookup': {
                'from': "users",
                'localField': "members",
                'foreignField': "_id",
                'as': "members"
            }
        },
        {
            '$lookup': {
                'from': "users",
                'localField': "admins",
                'foreignField': "_id",
                'as': "admins"
            }
        },
        {
            '$lookup': {
                'from': "users",
                'localField': "banned",
                'foreignField': "_id",
                'as': "banned"
            }
        },
        {
            $project: {
                'admins._id':1,
                'admins.name':1,
                'admins.surname':1,
                'admins.university':1,
                'admins.email':1,
                'members._id':1,
                'members.name':1,
                'members.surname':1,
                'members.university':1,
                'members.email':1,
                'pending._id':1,
                'pending.name':1,
                'pending.surname':1,
                'pending.university':1,
                'pending.email':1,
                'banned._id':1,
                'banned.name':1,
                'banned.surname':1,
                'banned.university':1,
                'banned.email':1,
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
                res.status(200).json(result);
        }
        });

});

router.route('/setUser/:id').post(auth,(req,res)=> {
    const userId = req.cookies['userId'] || req.query.userId;
    const GroupId = req.params.id;
    const action = req.body.action; //"Promote", "Degrade", "Ban", "Accept", "UnBan"
    const user__ = req.body.user ;

    switch (action) {
        case "Promote":
            Group.updateOne({_id:GroupId,admin:userId},{$pull: {users: user__,},$push: {admin:user__}})
                .then(() => {
                    res.json("Promoted!");
                })
                .catch((err) => {
                    res.status(400).json('Error: ' + err);
                });
            break;
        case "Degrade":
            Group.updateOne({_id:GroupId,admin:userId},{$push: {users: user__,},$pull: {admin:user__}})
                .then(() => {
                    res.json("Degraded!");
                })
                .catch((err) => {
                    res.status(400).json('Error: ' + err);
                });
            break;
        case "Ban":
            Group.updateOne({_id:GroupId,admin:userId},{$push: {banned: user__,},$pull: {users:user__,pending:user__}})
                .then(() => {
                    res.json("Degraded!");
                })
                .catch((err) => {
                    res.status(400).json('Error: ' + err);
                });
            break;
        case "Accept":
            Group.updateOne({_id:GroupId,admin:userId},{$push: {users: user__,},$pull: {pending:user__}})
                .then(() => {
                    res.json("Accepted in the group!");
                })
                .catch((err) => {
                    res.status(400).json('Error: ' + err);
                });
            break;
        case "UnBan":
            Group.updateOne({_id:GroupId,admin:userId},{$pull: {banned: user__,},$push: {users:user__}})
                .then(() => {
                    res.json("UnBanned!");
                })
                .catch((err) => {
                    res.status(400).json('Error: ' + err);
                });
            break;
        default:
            res.status(400).json("Error: Query not understood");
            break;

    }


    //res.json("Done!");
});

router.route('/search/:val').get(auth,(req, res) => {

    const userId = req.cookies['userId'] || req.query.userId;

    const value = req.params.val;
    Group.find( {name:{$regex:".*"+ value + ".*"} ,admin:userId},{name:1,description:1,_id:1})
        .limit( 10 )
        .then((response) => {
            res.json(response);
        })
        .catch((err) => res.status(400).json("Error: " + err));

});



module.exports = router;
