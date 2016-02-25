var crypto = require('crypto');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    title: String,
    content: String,
    img: String,
    creater: String,
    created: {
        type: Date,
        default: Date.now
    }
});

console.log('i in post.js');

exports.Post = mongoose.model('Post', schema);