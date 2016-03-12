/**
 * Created by Pritok on 11.03.2016.
 */
var CorrDb = require('../models/userMessage').userMessage;
var mongoose = require('mongoose');

module.exports = function () {
    this.saveCorrespondence = function (req, res, next) {
        console.log('correspondence is saved!');
        var reqUser1 = req.body.sender.user1;
        var reqUser2 = req.body.sender.user2;
        var currMessage = req.body.textMessage;
        console.log('hello Find One!!');

        CorrDb.findOne({user1: reqUser1, user2: reqUser2}, function(err, mess) {
            if (err) {
                next(err);
            }
            console.log('im passed!!');
            if (mess) {
                mess.messages.push(currMessage);
                CorrDb.update({user1: mess.user1, user2: mess.user2}, {messages: mess.messages}, function () {
                    res.status(200).send();
                });
            } else {
                CorrDb.findOne({user1: reqUser2, user2: reqUser1}, function (err, mess) {
                    if (err) {
                        next(err);
                    }
                    if (mess) {
                        mess.messages.push(currMessage);
                        CorrDb.update({user1: mess.user1, user2: mess.user2}, {messages: mess.messages}, function () {
                            res.status(200).send();
                        });
                    } else {
                        var message = CorrDb({
                            user1: reqUser1,
                            user2: reqUser2,
                            messages: [currMessage]
                        });

                        message.save(function(err, doc) {
                            if (err) {
                                return next(err);
                            }

                            res.status(200).send();
                        });
                    }
                });
            }
        });
    };

    this.getUserMessages = function (req, res, next) {
        console.log('i get data user messages');
        var user1 = req.query.user1;
        var user2 = req.query.user2;
        console.log('user1 => ' + user1, 'user2 => ', user2);

        CorrDb.findOne({
            user1: user1,
            user2: user2
        }, function (err, user) {
            if (err) {
                return next(err);
            }
            console.log('user ', user);
            if (user) {
                console.log('im set headers');
                res.send({messages: user.messages});
            } else {
                CorrDb.findOne({
                    user1: user2,
                    user2: user1
                }, function (err, user) {
                    if (err) {
                        return next(err);
                    }

                    if (user) {
                        res.status(200).send({messages: user.messages})
                    } else {
                        res.status(200).send({messages: []})
                    }
                });
            }
        });
    };

};