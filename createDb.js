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
   // dropDatabase,
    requireModels,
    createUsers
], function(err, results){
    console.log("Hello");
    console.log(arguments);
});

//open connecting in db
function open(callback) {
    console.log("connection detected!");
    mongoose.connection.on('open', callback);
}

function requireModels(callback) {
    require('./dbmodels/user').User;

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {
    var users = [
        {
            "username" : "admin",
            password: '5356250',
            "email" : "pritok@i.ua",
            "img" : "images/Admin-designstyle-colors-m.png",
            "address" : "Kyiv",
            "birthday" : "2016-02-23T14:24:05.931Z"
        }, {
            "img" : "images/2013-08-02_15-02-24_499.jpg",
            "username" : "Natalka",
            password: '5356250',
            "email" : "pritok@i.ua",
            "address" : "Kyiv",
            "birthday" : "1992-01-27T00:00:00Z"
        }, {
            "img" : "images/100_4044.JPG",
            "username" : "Artur",
            password: '5356250',
            "email" : "artur@i.ua",
            "address" : "Kyiv",
            "birthday" : "1993-04-26T00:00:00Z"
        }, {
            "img" : "images/DSC_4737.jpg",
            "username" : "Konstantin",
            password: '5356250',
            "email" : "Andrew@i.ua",
            "address" : "Kyiv",
            "birthday" : "1992-12-13T00:00:00Z"
        }, {
            "img" : "images/question.png",
            "username" : "Max",
            password: '5356250',
            "email" : "Max@i.ua",
            "address" : "Kyiv",
            "birthday" : "1990-02-22T00:00:00Z"
        }, {
            "img" : "images/DSC_0062.jpg",
            "username" : "Roma",
            password: '5356250',
            "email" : "pritok@i.ua",
            "address" : "Kyiv",
            "birthday" : "1993-08-14T00:00:00Z"
        }, {
            "img" : "images/DSC_0369.jpg",
            "username" : "Krava",
            password: '5356250',
            "email" : "millenium@mail.ru",
            "address" : "Kyiv",
            "birthday" : "1993-12-03T00:00:00Z"
        }
    ];
    async.each(users, function (userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

//dropped db

function dropDatabase(callback) {
    console.log("db dropped!");
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

//listen events on the 'open' and calling function dropDB
mongoose.connection.on('open', function(){
    var db = mongoose.connection.db;

    db.dropDatabase(function(err) {
        if (err) throw  err;
        console.log('OK');
    });

});
