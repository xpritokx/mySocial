var UserDb = require('../models/user').User;
var mongoose = require('mongoose');
var geoLock = require('../helpers/findLocation');

module.exports = function () {

    this.addFriends = function (req, res, next) {

        //finding current user by Id
        UserDb.findById(req.session.user.userId, function (err, firstUser) {
            if (err) {
                next(err);
            }

            //get mass with user friends current user
            var firstUserMasFriends = firstUser.friends;

            //if second user is not in friends current user that adding second user in to friends current user
            if (firstUserMasFriends.indexOf(req.body.userId) === -1) {
                firstUserMasFriends.push(req.body.userId);

                UserDb.update({_id: req.session.user.userId}, {friends: firstUserMasFriends}, function () {

                    //finding second user by Id
                    UserDb.findById(req.body.userId, function (err, secondUser) {
                        if (err) {
                            next(err);
                        }

                        //get mass with user friends second user
                        var secondUserMasFriends = secondUser.friends;

                        //if current user is not in friends second user that adding current user in to friends second user
                        if (secondUserMasFriends.indexOf(req.session.user.userId) === -1) {
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

        function forLastFriend(collFriends){
            for (i = 0; i < collFriends.length; i++) {
                collFriends[i].set({dist: geoLock(req.session.user.coords.latitude, collFriends[i].coords.latitude, req.session.user.coords.longitude, collFriends[i].coords.longitude)});
                //console.log('geolockation for friends ', collFriends[i].username, collFriends[i].dist);
            }
        }

        //if user is authorized //(remove it...)
        if (req.session.user) {

            //finding current user
            UserDb.findById(req.session.user.userId,{hashedPassword: 0}, function (err, user) {
                if (err) {
                    next(err);
                }

                if (user) {

                    //get mass with user friends current user
                    masFriends = user.friends;
                    if (masFriends.length > 0) {
                        collFriends = [];
                        i = 0;
                        deletedUsers = 0;

                        //passed mas friends
                        for (i; i < masFriends.length; i++) {

                            //finding user by id
                            UserDb.findById(masFriends[i],{hashedPassword: 0}, function (err, user) {

                                //if user is it that pushing user in to collFriends
                                if (user) {
                                    collFriends.push(user);

                                    //for last user we passed all collFriends and computing distance and send users in to server
                                    if ((collFriends.length + deletedUsers) === masFriends.length) {

                                        forLastFriend(collFriends);

                                        res.status(200).send(collFriends);
                                    }

                                } else {
                                    //increment count deleted users
                                    deletedUsers++;

                                    if ((collFriends.length + deletedUsers) === masFriends.length) {

                                        forLastFriend(collFriends);

                                        res.status(200).send(collFriends);
                                    }
                                }
                            });
                        }
                    } else {
                        res.status(200).send([])
                    }
                } else {
                    res.status(200).send([])
                }
            });
        }
    };

    this.delFromFriends = function(req, res, next) {
        var idUser = req.session.user.userId;
        var idOpponent = req.params.id;

        UserDb.findById(idUser, function (err, user) {
            if (err) {
                return next(err);
            }
            console.log('User Friends Updated! To', user.friends);

            //get friends current User
            var friendsUser = user.get('friends');
            var positionOpponent = friendsUser.indexOf(idOpponent);


            //deleting opponent id with current user array friends
            if (positionOpponent >= 0) {
                friendsUser.splice(positionOpponent, 1);
            }

            UserDb.update({_id: idUser}, {friends: friendsUser}, function () {
                console.log('User Friends Updated! Do', user.friends);
            });

            UserDb.findById(idOpponent, function (err, user) {
                if (err) {
                    return next(err);
                }

                console.log('Opponent Friends Updated! To', user.friends);

                //get friends Opponent
                var friendsOpponent = user.get('friends');
                var positionUser = friendsOpponent.indexOf(idUser);


                //deleting current user id with opponent array friends
                if (positionUser >= 0) {
                    friendsOpponent.splice(positionUser, 1);
                }

                UserDb.update({_id: idOpponent}, {friends: friendsOpponent}, function () {
                    console.log('Opponent Friends Updated! Do', user.friends);
                });

                res.status(200).send({response: true})
            })
        })
    };

    this.delFriend = function (req, res, next) {
        var id = req.params.id;
        console.log('Receive a DELETE friend request for _id: ' + id);

        UserDb.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return next(err);
            }

            delete user.hashedPassword;

            res.status(200).send(user);
        });
    };

};