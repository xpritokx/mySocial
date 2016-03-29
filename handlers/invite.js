var UserDb = require('../models/user').User;
var CountDB = require('../models/count_messages').Count;
var mongoose = require('mongoose');

module.exports = function () {

    this.canceledInvite = function (req, res, next) {

        //if count with username current user is it that we find invites array and deleting opponent Id
        CountDB.findOne({username: req.session.user.username}, function (err, count) {
            if (err) {
                return next(err);
            }

            var masInvites;

            if (count) {
                masInvites = count.invites;

                var posOpponent = masInvites.indexOf(req.body.userId);

                if (posOpponent >= 0) {
                    masInvites.splice(posOpponent, 1);
                }

                CountDB.update({username: req.session.user.username}, {invites: masInvites}, function(err, result) {
                    console.log('mas canceled invites is updated!');
                });

                res.status(200).send({result: true});
            } else {
                res.status(200).send();
            }
        });
    };

    this.getInvite = function (req, res, next) {
        CountDB.findOne({username: req.session.user.username}, function (err, user) {
            if (err) {
                return next()
            }
            console.log('im ', req.session.user.username, 'gettingInvites');

            var masFriends;
            var i = 0;
            var newMasFriends = [];

            if (user) {
                console.log('im find user!');

                masFriends = user.invites;

                if (!masFriends.length) {
                    console.log('mas user is empty!');

                    res.status(200).send();
                }

                for (i; i < masFriends.length; i++) {

                    UserDb.findById(masFriends[i], function (err, user) {
                        if (err) {
                            return next()
                        }

                        if (user) {
                            newMasFriends.push(user);

                            console.log('masFriends ',masFriends);
                            console.log('newMasFriends ',newMasFriends);
                            if (newMasFriends.length === masFriends.length) {
                                res.status(200).send(newMasFriends);
                            }
                        } else {
                            console.log('im not find friends!');

                            res.status(200).send();
                        }
                    });
                }
            } else {
                console.log('im not find user!');

                res.status(200).send();
            }
        });
    };

    this.addInvite = function (req, res, next) {
        var userModel;
        var opponentModel;
        console.log('im adding user!');

        //finding current user by Id
        UserDb.findById(req.session.user.userId, {hashedPassword: 0} , function (err, firstUser) {
            if (err) {
                next(err);
            }

            userModel = firstUser;

            //get mass with user friends current user
            var firstUserMasFriends = firstUser.friends;

            //if second user is not in friends current user that adding second user in to friends current user
            if (firstUserMasFriends.indexOf(req.body.userId) === -1) {
                firstUserMasFriends.push(req.body.userId);

                UserDb.update({_id: req.session.user.userId}, {friends: firstUserMasFriends}, function () {

                    //finding second user by Id
                    UserDb.findById(req.body.userId, {hashedPassword: 0}, function (err, secondUser) {
                        if (err) {
                            return next(err);
                        }

                        opponentModel = secondUser;

                        //get mass with user friends second user
                        var secondUserMasFriends = secondUser.friends;

                        //if current user is not in friends second user that adding current user in to friends second user
                        if (secondUserMasFriends.indexOf(req.session.user.userId) === -1) {
                            secondUserMasFriends.push(req.session.user.userId);

                            UserDb.update({_id: req.body.userId}, {friends: secondUserMasFriends}, function () {

                                //deleting id opponent with current user invites array
                                CountDB.findOne({username: req.session.user.username}, function (err, count) {
                                    if (err) {
                                        return next(err);
                                    }

                                    var masInvites;

                                    if (count) {
                                        masInvites = count.invites;

                                        var posOpponent = masInvites.indexOf(req.body.userId);

                                        if (posOpponent >= 0) {
                                            masInvites.splice(posOpponent, 1);
                                        }

                                        CountDB.update({username: req.session.user.username}, {invites: masInvites}, function(err, result) {
                                            console.log('mas invites is updated!');
                                        });

                                        res.status(200).send({
                                            firstUser : firstUser.username,
                                            secondUser: secondUser.username,
                                            userModel: userModel,
                                            opponentModel: opponentModel,
                                            firstUserId: firstUser._id,
                                            secondUserId: secondUser._id
                                        });
                                    } else {
                                        res.status(200).send();
                                    }
                                });
                            });
                        }
                    });
                });
            }
        });
    };
};