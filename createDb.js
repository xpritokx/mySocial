/**
 * Created by Pritok on 16.02.2016.
 */
var mongoose = require('mongoose'); //Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var async = require('async'); //module which provides straight-forward, powerful functions for working with asynchronous JavaScript.

//connecting to database
mongoose.connect("mongodb://localhost/social",{
    "server": {
        "socketOptions": {
            "keepAlive": 1
        }
    }
});

//called function in query, after exepting callback
async.series([
    open,
    dropDatabase
], function(err, results){
    console.log("Hello");
    console.log(arguments);
});

//open connecting in db
function open(callback) {
    console.log("connection detected!");
    mongoose.connection.on('open', callback);
}

//dropped db
function dropDatabase(callback) {
    console.log("db dropped!");
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

//listen events on the 'open' and calling function dropDatabase
mongoose.connection.on('open', function(){
    var db = mongoose.connection.db;

    db.dropDatabase(function(err) {
        if (err) throw  err;
        console.log('OK');
    });
});
