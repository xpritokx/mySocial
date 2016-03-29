var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    sender: Object,
    textMessage: String,
    date: {
        type: Date,
        default: Date.now
    }
});

console.log('schema message is generated!');
exports.Message = mongoose.model('Message', schema);