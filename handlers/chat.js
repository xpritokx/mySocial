/**
 * Created by Pritok on 09.03.2016.
 */
var ChatDb = require('../models/message').Message;
var mongoose = require('mongoose');

module.exports = function () {
    this.getMessages = function(req, res, next) {
        console.log('i get messages!');

        ChatDb.find({}, function (err, chats) {
            if (err) {
                return next(err);
            }

            chats.forEach(function (item) {
                console.log('Received a GET request for _id for /CHAT ' + item.textMessage);
                console.log('Received a GET request for _id for /CHAT ' + item.sender.senderName);
                console.log('Received a GET request for _id for /CHAT ' + item.sender.img);
                console.log('Received a GET request for _id for /CHAT ' + item.date);


            });

            res.status(200).send(chats);
        });
    };

    this.sendMessage = function(req, res, next) {
        console.log('i send message!');
        var message = ChatDb(req.body);

        for (var key in req.body) {
            console.log(key + ": " + req.body[key])
        }

        message.save(function(err, doc) {
            if (err) {
                return next(err);
            }

            console.log(doc.sender.senderName + ' is saved');

            res.status(200).send(doc);
        });
    };

    this.delMessage = function(req, res, next) {
        var id = req.params.id;

        console.log('Receive a DELETE message for _id: ' + id);

        ChatDb.findByIdAndRemove(id, function (err, delMess) {
            if(err) {
                return next(err);
            }

            res.status(200).send(delMess);
        });

    };


};


