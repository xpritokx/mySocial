var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: String,
    data: {
        type: Object,
        default: {}
    },
    invites: {
        type: Array,
        default: []
    }
});

console.log('schema message is generated!');
exports.Count = mongoose.model('Count', schema);