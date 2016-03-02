var crypto = require('crypto');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    title: String,
    content: String,
    img: String,
    creater: String,
    createrImg: String,
    created: {
        type: Date,
        default: Date.now
    }
});

console.log('schema post is generated!');
exports.Post = mongoose.model('Post', schema);