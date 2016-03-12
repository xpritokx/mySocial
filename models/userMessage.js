/**
 * Created by Pritok on 11.03.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user1: String,
    user2: String,
    messages: {
        type: Array,
        defaults: []
    }
});

console.log('schema userMessage is generated!');
exports.userMessage = mongoose.model('userMessage', schema);