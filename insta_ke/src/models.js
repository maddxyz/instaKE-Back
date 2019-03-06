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

// Images will be retrieved by their id
var ImageSchema = new Schema({
    user: UserSchema,
    addDate: Date,
    description: String,
    img: String
});

var User = mongoose.model('User', UserSchema);
var Image = mongoose.model('Image', ImageSchema);

module.exports = { User, Image};