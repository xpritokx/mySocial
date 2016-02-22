//var app = require('../app');
var UserDb = require('../dbmodels/user').User;
var User = require('../models/User');
var Admin = require('../models/Admin');
//var bodyParser = require('body-parser');

admin = new Admin.Admin(6,5,4,3,2,1,0);
user = new User.User(1,2,3,4,5,6,7);

module.exports = function(app) {

    //#TESTING URL!!!
    // output all users in JSON Format
    app.route('/users').get(function(req, res){
        UserDb.find(function(err, users) {
            users.forEach(function(item) {
               console.log('Received a GET request for _id' + item._id);
            });
            res.send(users);
        });
    });


    //#TESTING URL!!!
    // output all users in JSON Format for method POST
    app.post('/users', function(req,res){
        console.log('Receive a POST request');
        for (var key in req.body) {
            console.log(key + ": " + req.body[key])
        }
        var users = new UserDb(req.body);
        users.save(function(err, user) {
            console.error(err);
            res.send(user);
        })
    });

    //#TESTING URL!!!
    // output all users in JSON Format
    app.route('/db').get(function(req, res){
        UserDb.find({}, function(err, users) {
            if (err) throw(err);
            res.json(users);
        });
    });

    //#TESTING URL!!!
    // output all users in JSON Format by ID
    app.route('/db/:id').get(function(req, res){
        UserDb.findById(req.params.id, function(err, user) {
            if (err) throw err;
            if (!user) {
                console.log(404 + " This user id is not found");
            }
            res.json(user);
        })
    });

    //confirming user on the authorization
    app.route('/userIsValid').get(function(req,res){
        console.log('Receive a GeT User request');
        //console.log(req.params);

        if (req.session.user) {
            res.send({val: true, userId: req.session.user});
        } else {
            res.send({val: false});
        }
    });

    //confirming user on the authorization
    app.post('/userIsValid', function(req,res){
        console.log('Receive a POST request');
        for (var key in req.body) {
            console.log(key + ": " + req.body[key])
        }
        if (req.session.user) {
            req.body.userIsAuthorised.set(true);
            res.body.send();
        } else {
            req.body.userIsAuthorised.set(false);
            res.body.send();
        }
    });

    // disconnecting users
    app.route('/logOut').get(function(req, res){
        console.log(req);
        req.session.destroy();
        console.log("Session Destroyed!!!");
        res.redirect("/#main");
    });


    // output all users in JSON Format
    app.route('/userLog').get(function(req, res){
        UserDb.find(function(err, users) {
            users.forEach(function(item) {
                console.log('Received a GET request for _id' + item._id);
            });
            res.send(users);
        });
    });

    // parsing POST userLog form and verification user and password in db
    app.post('/userLog', function(req,res){
        console.log('Receive a POST request');
        val = {};
        for (var key in req.body) {
            console.log(key + ": " + req.body[key]);
            val[key] = req.body[key];
        }
        var username = req.body.username;
        var password = req.body.password;

        console.log("username = ", username, "password = ", password);

        //finding one user which match our password and username in db, and output data to client
        UserDb.findOne({username: username}, function(err, user){
            if (user) {
                if (user.checkPassword(password)){
                    console.log("User is found");
                    req.session.user = user._id;
                    console.log(user);
                    res.send(user);
                } else {
                    console.log("password is not true!");
                }
            } else {
                console.log("User is not found!");
            }
        })

    });

    //deleting user by id
    app.delete('/users/:id', function(req, res, next){
        console.log('Receive a DELETE request for _id: ' + req.params.id);
        UserDb.remove({_id: req.params.id}, function(err){
            next(err);
            res.send({_id: req.params.id})
        });
    });

    //update user info by id
    app.put('/users/:id', function(req,res){
        console.log('Receive an UPDATE request for _id: ' + req.params.id);
        UserDb.update({_id: req.params.id}, req.body, function(err){
            res.send({_id: req.params.id})
        });
    });
};