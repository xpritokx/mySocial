var UserDb = require('../models/user').User;
var mongoose = require('mongoose');
var geoLock = require('../helpers/findLocation');


module.exports = function () {
    this.verify = function (req, res, next) {
        var id = req.params.id;

        UserDb.findByIdAndUpdate(id, {$set: {applied: true}}, function (err, user) {
            if (err) {
                return next(err);
            }

            res.redirect('/#main');
        })
    };

    this.enterInToSite = function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        console.log('Receive a POST request for User Log In !');

        //when user is authorized, update him coordinates for computing distance
        if (req.body.coords) {
            UserDb.update({username: username}, {coords: req.body.coords}, function(){
                console.log('coords updated for'+ username + '!');
            });
        }

        //finding one user which match our password and username in db, and output data to client
        UserDb.findOne({username: username}, function (err, user) {
            if (err) {
                next(err);
            }

            //user can entering when user is applied -> true
            if ((user) && (user.get('applied'))) {
                console.log('User' + user.username + 'is found');

                //checking hashed passwords
                if (user.checkPassword(password)) {
                    console.log('password for ' + user.username + ' is true!');

                    //creating session with user identificator and user coords
                    req.session.user = {
                        userId: user._id,
                        username: user.username,
                        coords: req.body.coords,
                        admin: user.admin
                    };

                    delete user.hashedPassword;

                    //setting base coords for user
                    user.set({
                        dist: geoLock(req.session.user.coords.latitude, user.coords.latitude, req.session.user.coords.longitude, user.coords.longitude)
                    });

                    res.status(200).send(user);
                } else {
                    console.log('password for ' + user.username + ' is not true!');
                    res.status(200).send();
                }
            } else {
                console.log('User ' + username + ' is not found!');
                res.status(200).send();
            }
        });
    };
};