var CorrDb = require('../models/userMessage').userMessage;
var mongoose = require('mongoose');

module.exports = function () {
    this.saveCorrespondence = function (req, res, next) {
        console.log('correspondence is saving!');
        var reqUser1 = req.body.sender.user1;
        var reqUser2 = req.body.sender.user2;
        var currMessage = req.body.textMessage;

        //finding one correspondence two users
        CorrDb.findOne({user1: reqUser1, user2: reqUser2}, function (err, mess) {
            if (err) {
                next(err);
            }

            if (mess) {

                //adding new message in to messages storage
                mess.messages.push(currMessage);

                //updating current messages correspondence
                CorrDb.update({user1: mess.user1, user2: mess.user2}, {messages: mess.messages}, function () {
                    res.status(200).send();
                });
            } else {
                //if correspondence such users not found that we find other tho users
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
                        //if correspondence such users not found that we create new correspondence two users in db
                        var message = CorrDb({
                            user1: reqUser1,
                            user2: reqUser2,
                            messages: [currMessage]
                        });

                        message.save(function (err, doc) {
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
        console.log('i getting user messages');
        var user1 = req.query.user1;
        var user2 = req.query.user2;

        //finding one correspondence two users
        CorrDb.findOne({user1: user1, user2: user2}, function (err, user) {
            if (err) {
                return next(err);
            }

            if (user) {
                res.send({messages: user.messages});
            } else {
                //if correspondence such users not found that we find other tho users
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