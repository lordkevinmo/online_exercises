const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
        users: {type: Array}, //["id",..]
        admin: {type: Array}, //[{userId: "",isCreator:Boolean},..]
        exercises: {type:Array, default: []},  //["id",..]
        name: {type: String},
        description: {type: String},
        isPublic: {type: Boolean, default: false}, //Anyone with the link can directly join **Maybe one day make a list of public group**
        pending: {type: Array}, //user who ASK to join the group and need to be validated by the admin
        banned: {type: Array}
});

const Group = mongoose.model('Group',GroupSchema);

module.exports = Group;
