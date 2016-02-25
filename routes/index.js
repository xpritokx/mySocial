var UserDb = require('../dbmodels/user').User;
var User = require('../models/User');
var Admin = require('../models/Admin');
var mongoose = require('mongoose');
var multiparty = require('multiparty');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

admin = new Admin.Admin(6,5,4,3,2,1,0);
user = new User.User(1,2,3,4,5,6,7);

module.exports = function(app) {

    function sendEmail(to, title, text) {

        var transport = nodemailer.createTransport(
            smtpTransport({
                service: 'gmail',
                auth: {
                    user: 'xpritokx@gmail.com',
                    pass: 'xapdcop5356250'
                }
            })
        );

        var params = {
            from: 'xpritokx@gmail.com',
            to: to,//req.body.email,
            subject: title,//sender + ' welcomes you!',
            text: text//'Hello i want to invite you in the Public House! Just click in this link www.publichouse.com.ua'
        };

        transport.sendMail(params, function (err, res) {
            if (err) {
                console.error("mail err = ", err);
            }
        });

    }


    //-------------------------------------------------------------------------------------
    //--------CRUD----------------CRUD----------------CRUD----------------CRUD-------------
    //-------------------------------------------------------------------------------------


    // output all users in JSON Format
    app.route('/users').get(function(req, res){
        UserDb.find(function(err, users) {
            users.forEach(function(item) {
               console.log('Received a GET request for _id for /users ' + item._id);
            });
            res.send(users);
        });
    });

    //// output all users in JSON Format POST method
    app.post('/users', function(req,res){
        console.log('Receive a POST request for registration');
        for (var key in req.body) {
            console.log(key + ": " + req.body[key])
        }
        var user = new UserDb(req.body);
        user.save(function(err, doc) {
            var to = user.get('email');
            var title = 'Verification Public House';
            var text = 'click to link for verification =) localhost:3060/#connected_user/' + user.get('_id');
            sendEmail(to ,title, text);

            res.send(doc);
        })


    });



    // output all friends in JSON Format
    app.route('/friends').get(function(req, res) {
        console.log('i am add friends Here ');
        if (req.session.user) {
            UserDb.findById(req.session.user, function(err, user) {
                var masFriends = user.friends;
                if (masFriends.length >= 1) {
                    var collFriends = [];
                    var i = 0;
                    for (i; i < masFriends.length; i++) {
                        console.log('i am add friends ' + masFriends[i]);
                        UserDb.findById(masFriends[i], function(err, user) {
                            collFriends.push(user);
                            if (collFriends.length == masFriends.length) {
                                res.send(collFriends);
                            }
                        });
                    }
                } else {
                    res.send()
                }
            });
        }
    });

    // output all users in JSON Format
    app.route('/userLog').get(function(req, res){
        UserDb.find(function(err, users) {
            users.forEach(function(item) {
                console.log('Received a GET request for _id for UserLog!' + item._id);
            });
            res.send(users);
        });
    });

    //deleting user by id
    app.delete('/friends/:id', function(req, res){
        console.log('Receive a DELETE request for _id: ' + req.params.id);
        console.log(req.params);
        var id = req.params.id;
        UserDb.remove({_id: id}, function(){
            res.send({_id: id})
        });
    });

    //deleting user by id
    app.delete('/users/:id', function(req, res){
        console.log('Receive a DELETE request for _id: ' + req.params.id);
        console.log(req.params);
        var id = req.params.id;
        UserDb.remove({_id: id}, function(){
            res.send({_id: id})
        });
    });



    //update user info by id
    app.put('/users/:id', function(req,res){
        console.log('Receive an UPDATE request for _id: ' + req.params.id);
        console.log(req.params);
        UserDb.update({_id: req.params.id}, req.body, function(){
            res.send({_id: req.params.id})
        });
    });

    //-------------------------------------------------------------------------------------
    //--------TEST----------------TEST----------------TEST----------------TEST-------------
    //-------------------------------------------------------------------------------------


    //#TESTING URL!!!
    // output all users in JSON Format
    app.route('/db').get(function(req, res){
        UserDb.find({}, function(err, users) {
            if (err) throw(err);
            res.json(users);
        });
    });


    //#TESTING URL!!!
    // console.log('bla - bla - bla')
    app.route('/upload').get(function(req, res) {
        console.log("bla - bla - bla");
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
        console.log('this passed validation user');

        if (req.session.user) {
            res.send({
                val: true,
                userId: req.session.user
            });
        } else {
            res.send({val: false});
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    //------OTHER_ROUTES----------------OTHER_ROUTES----------------OTHER_ROUTES----------------OTHER_ROUTES------------
    //------------------------------------------------------------------------------------------------------------------


    //sending email in to description email
    app.post('/sendEmail', function(req, res) {
        console.log('Receive a POST request, EMAIL');
        for (var key in req.body) {
            console.log(key + ": " + req.body[key])
        }

        UserDb.findById(req.session.user, function(err, user) {
            if (err) throw err;
            var sender = user.username;
            console.log("email sender = ", sender);
            sendEmail(req.body.email, sender + ' welcomes you!', 'Hello i want to invite you in the Public House! Just click in this link www.publichouse.com.ua');

        });

    res.redirect('/#showUsers');


    });

    //adding user id to array for two users
    app.post('/addFriends', function(req, res){
        console.log('Adding friend ' + req.body.userId +  ' is processing');
        UserDb.findById(req.session.user, function(err, firstUser) {
            if (err) throw err;
            var firstUserMasFriends = firstUser.friends;
            console.log('firstUserMasFriends = ' ,firstUserMasFriends);
            if (firstUserMasFriends.indexOf(req.body.userId) == -1) {
                firstUserMasFriends.push(req.body.userId);
                UserDb.update({_id: req.session.user}, {friends: firstUserMasFriends}, function(){
                    UserDb.findById(req.body.userId, function(err, secondUser) {
                        var secondUserMasFriends = secondUser.friends;
                        console.log('secondUserMasFriends = ', secondUserMasFriends);
                        if (secondUserMasFriends.indexOf(req.session.user) == -1) {
                            secondUserMasFriends.push(req.session.user);
                            UserDb.update({_id: req.body.userId}, {friends: secondUserMasFriends}, function () {
                                res.send({firstUser: firstUser.username, secondUser: secondUser.username});
                            })
                        }
                    })
                });
            }
        });
    });

    //confirming user on the authorization
    app.post('/userIsValid', function(req, res){
        console.log('Receive a POST request of validation User!');
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
    app.route('/logOut').get(function(req, res) {
        req.session.destroy();
        console.log('Session Destroyed!!!');
        res.redirect('/#main');
    });

    // uploading data
    app.post('/upload', function(req, res) {
        console.log('i am here in upload file!');

        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {

            var img = files.images[0];
            fs.readFile(img.path, function(err, data) {
                var path = './public/images/' + img.originalFilename;

                fs.writeFile(path, data, function(err){
                    if(err) {
                        console.log(err);
                    }
                });

                UserDb.update({_id: req.session.user}, {img: (path).slice(9)}, function(){
                    console.log('Img Updated!');
                });
                UserDb.find(function(err, users) {
                    users.forEach(function(item) {
                        console.log('Is here a POST request for _id ' + item._id);
                        console.log('Is here a POST request for img ' + item.img);
                    });
                });

                console.log("path = ", path);
                console.log("iD userSession = ",req.session.user);


                res.redirect('/#showUsers');
            });
        });
    });


    app.post('/sendRestore', function(req, res){
        console.log('"/sendRestore" verifing Email ' + req.body.email);
        UserDb.findOne({email: req.body.email}, function(err, user) {
            if(!user) {
                console.log('user with this email is not found!');
                res.send({message: false})
            } else {

                console.log(user.get('username'));
                sendEmail(req.body.email, user.get('username') + ' you password is here!', 'Hello ' + user.get('username') + ' your password from Public House is ' + user.get('password'));

                res.send({message: true});
            }
        });
    });

    // parsing POST userLog form and verification user and password in db
    app.post('/userLog', function(req,res){
        console.log('Receive a POST request for UserLog!');
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
                    res.send(user);
                } else {
                    console.log('password is not true!');
                }
            } else {
                console.log('User is not found!');
            }
        })

    });






};