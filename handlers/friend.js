var UserDb = require('../models/user').User;
var CountDB = require('../models/count_messages').Count;
var mongoose = require('mongoose');
var geoLock = require('../helpers/findLocation');

module.exports = function () {

    this.addFriends = function(req, res, next) {
        var idOpponent = req.body.userId;

        //creating new counter invites
        function createNewInvites (usernameOpponent) {
            var newCount;

            console.log('create new, and update invite for opponent');

            count = {
                username: usernameOpponent,
                data: {},
                invites: [req.session.user.userId]
            };

            count.data[req.session.user.username] = 0;

            newCount = new mongoose.models.Count(count);

            console.log('new opponent saved');

            newCount.save(function(err, count) {
                if (err) {
                    return next(err)
                }

                console.log('saved invites => ', count);
                res.status(200).send({result: true});
            });
        }

        //find opponent for find counter invites this opponent
        UserDb.findById(idOpponent, function (err, opponent) {
            if (opponent) {

                //find counter this opponent if counter is none that created new
                CountDB.findOne({username: opponent.username}, function (err, count) {

                    if (count) {

                        //if opponent has already invited this user we are not adding new
                        if (count.invites.indexOf(req.session.user.userId) >= 0) {
                            res.status(200).send({result: false});
                        } else {

                            //opponent pushed current user to invited array
                            CountDB.update({username: opponent.username}, {$push: {invites: req.session.user.userId}}, function (err, result) {
                                console.log('result updating invite to friends! ', result);

                                if (err) {
                                    return next(err);
                                }

                                //if opponent is not have invites array we are creating new
                                if (result.nModified) {

                                    console.log('update invite! for opponent');
                                    res.status(200).send({result: true});
                                } else {
                                   createNewInvites(opponent.username);
                                }
                            });
                        }
                    } else {
                        createNewInvites(opponent.username);
                    }
                })
            }
        });
    };

    this.getFriends = function (req, res, next) {
        var masFriends;
        var collFriends;
        var i;
        var deletedUsers;

        //function computing distance for all friends
        function forLastFriend(collFriends){
            for (i = 0; i < collFriends.length; i++) {
                collFriends[i].set({dist: geoLock(req.session.user.coords.latitude, collFriends[i].coords.latitude, req.session.user.coords.longitude, collFriends[i].coords.longitude)});
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
        var pageOfUser;

        UserDb.findById(idUser, {hashedPassword: 0}, function (err, user) {
            if (err) {
                return next(err);
            }

            console.log('User Friends Updated! To', user.friends);

            //get friends current User
            var friendsUser = user.get('friends');
            var positionOpponent = friendsUser.indexOf(idOpponent);

            pageOfUser = user;

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

                res.status(200).send({
                    response: true,
                    user: pageOfUser
                })
            })
        })
    };
};