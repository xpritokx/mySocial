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
    email: String,
    birthday: {
        type: Date,
        default: Date.now
    },
    address: String,
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

console.log('i am in db file');


schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password').set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
}).get(function() {
    return this._plainPassword;
});

schema.methods.checkPassword = function(password) {
    //console.log("encr pas = ",this.encryptPassword(password));
    //console.log("this pas = ",this.hashedPassword);
    return this.encryptPassword(password) == this.hashedPassword;
};

exports.User = mongoose.model('User', schema);