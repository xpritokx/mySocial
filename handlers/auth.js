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
        var val = {};
        var username = req.body.username;
        var password = req.body.password;
        console.log('Receive a POST request for UserLog!');

        if (req.body.coords) {
            UserDb.update({username: username}, {coords: req.body.coords}, function(){
                console.log('coords updated!');
            });
        }

        for (var key in req.body) {
            console.log(key + ": " + req.body[key]);
            val[key] = req.body[key];
        }

        //finding one user which match our password and username in db, and output data to client
        UserDb.findOne({username: username}, function (err, user) {
            if (err) {
                next(err);
            }

            if ((user) && (user.get('applied'))) {

                if (user.checkPassword(password)) {
                    console.log("User is found");
                    req.session.user = {
                        userId: user._id,
                        coords: req.body.coords
                    };

                    delete user.hashedPassword;

                    user.set({dist: geoLock(req.session.user.coords.latitude, user.coords.latitude, req.session.user.coords.longitude, user.coords.longitude)});

                    res.status(200).send(user);
                } else {
                    console.log('password is not true!');
                    res.status(200).send();
                }
            } else {
                console.log('User is not found!');
                res.status(200).send();
            }
        });
    };
};