var crypto = require('crypto');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    img: {
        type: String,
        defaults: 'images/question.png'
    },
    birthday: {
        type: Date,
        default: Date.now
    },
    address: String,
    friends: {
        type: Array,
        default: []
    },
    salt: {
        type: String,
        required: true
    },
    applied: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

console.log('i in user.js');


schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

var objWithPasswords = {};

schema.virtual('password').set(function(password) {
    objWithPasswords.this = password;
    //this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
}).get(function() {
    //console.log("hello world " + objWithPasswords);
    return objWithPasswords.this;
});

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) == this.hashedPassword;
};


exports.User = mongoose.model('User', schema);