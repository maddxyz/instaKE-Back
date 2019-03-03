//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user: String,
    passwd: String,
    email: String,
    admin: Boolean
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
