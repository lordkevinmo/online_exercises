const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, required: true, trim: true},
    surname: {type: String, required: true, trim: true},
    university: {type:String, trim : true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
},
{
   timestamps:true
});

UserSchema.methods.generateHash = function(password) {
    return bcryptjs.hashSync(password, bcryptjs.genSaltSync(8),null);
};

UserSchema.methods.validPassword = function(password) {
    return bcryptjs.compareSync(password,this.password);
};

const User = mongoose.model('User',UserSchema);

module.exports = User;
