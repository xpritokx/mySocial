var UserDb = require('../models/user').User;
var mongoose = require('mongoose');
var geoLock = require('../helpers/findLocation');

module.exports = function () {

    this.addFriends = function (req, res, next) {
        UserDb.findById(req.session.user.userId, function (err, firstUser) {
            if (err) {
                next(err);
            }

            var firstUserMasFriends = firstUser.friends;

            if (firstUserMasFriends.indexOf(req.body.userId) == -1) {
                firstUserMasFriends.push(req.body.userId);

                UserDb.update({_id: req.session.user.userId}, {friends: firstUserMasFriends}, function () {

                    UserDb.findById(req.body.userId, function (err, secondUser) {
                        if (err) {
                            next(err);
                        }

                        var secondUserMasFriends = secondUser.friends;

                        if (secondUserMasFriends.indexOf(req.session.user.userId) == -1) {
                            secondUserMasFriends.push(req.session.user.userId);

                            UserDb.update({_id: req.body.userId}, {friends: secondUserMasFriends}, function () {
                                res.status(200).send({
                                    firstUser : firstUser.username,
                                    secondUser: secondUser.username
                                });
                            });
                        }
                    });
                });
            }
        });
    };

    this.getFriends = function (req, res, next) {
        var masFriends; //collections current user friends
        var collFriends; //new collection user friends
        var i; //counter
        var deletedUsers; //count user which been deleted

        if (req.session.user) {

            UserDb.findById(req.session.user.userId, function (err, user) {
                if (err) {
                    next(err);
                }

                if (user) {
                    masFriends = user.friends;
                    if (masFriends.length >= 1) {
                        collFriends = [];
                        i = 0;
                        deletedUsers = 0;

                        for (i; i < masFriends.length; i++) {

                            UserDb.findById(masFriends[i], function (err, user) {

                                if (user) {
                                    collFriends.push(user);

                                    if ((collFriends.length + deletedUsers) == masFriends.length) {

                                        for (i = 0; i < collFriends.length; i++) {
                                            collFriends[i].set({dist: geoLock(req.session.user.coords.latitude, collFriends[i].coords.latitude, req.session.user.coords.longitude, collFriends[i].coords.longitude)});
                                            console.log('geolockation for friends ', collFriends[i].username, collFriends[i].dist);
                                        }

                                        res.status(200).send(collFriends);
                                    }

                                } else {
                                    deletedUsers++;

                                    if ((collFriends.length + deletedUsers) == masFriends.length) {
                                        res.status(200).send();
                                    }
                                }
                            });
                        }
                    } else {
                        res.status(200).send()
                    }
                } else {
                    res.status(200).send()
                }
            });
        }
    };

    this.delFriend = function(req, res, next) {
        var id = req.params.id;
        console.log('Receive a DELETE request for _id: ' + id);

        UserDb.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return next(err);
            }

            delete user.hashedPassword;

            res.status(200).send(user);
        });
    }
};