//provides cryptographic functionality
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
    },
    coords: {
        type: Object,
        defaults: {
            latitude: 0,
            longitude: 0
        }
    },
    dist: String
});

//encrypting password of method sha1 + salt
schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

//store open passwords
var objWithPasswords = {};

//virtual field 'password', hide in model
schema.virtual('password').set(function(password) {
    objWithPasswords.this = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
}).get(function() {
    return objWithPasswords.this;
});

//comparing passwords
schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) == this.hashedPassword;
};

console.log('schema user is generated!');
exports.User = mongoose.model('User', schema);