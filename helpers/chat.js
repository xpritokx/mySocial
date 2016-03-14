var UserDb = require('../models/user').User;
var mongoose = require('mongoose');

module.exports = function (server) {
    var io = require('socket.io')(server);

    //creading namespace
    var my_nps = io.of('/my_namespace');

    //setting filter on domens
    io.set('origins', 'localhost:8088');

    //event onConnection
    my_nps.on('connection', function (socket) {

        //checking messave on event 'userChatStatus' for enter or exit with room
        socket.on('userChatStatus', function (data) {
            var roomNumber = data.user._id + data.opponent[0]._id;
            var roomNumber2 = data.opponent[0]._id + data.user._id;

            //if text => leaved that user exit with room else not user enter to room
            if (data.text === 'leaved') {
                console.log('user is leaved');
                if (my_nps.adapter.rooms[roomNumber]) {
                    socket.leave(roomNumber);
                    my_nps.to(roomNumber).emit('userChatStatusClient', {
                        username: data.user.username,
                        status: 'leaved'
                    });
                } else {
                    socket.leave(roomNumber2);
                    my_nps.to(roomNumber2).emit('userChatStatusClient', {
                        username: data.user.username,
                        status: 'leaved'
                    });
                }
            } else {
                console.log('user is connected to chat');
                if (my_nps.adapter.rooms[roomNumber]) {
                    socket.join(roomNumber);
                    my_nps.to(roomNumber).emit('userChatStatusClient', {
                        username: data.user.username,
                        status: 'connected'
                    });
                } else {
                    socket.join(roomNumber2);
                    my_nps.to(roomNumber2).emit('userChatStatusClient', {
                        username: data.user.username,
                        status: 'connected'
                    });
                }
            }
        });



        //checking message with client
        socket.on('userMessageServer', function (data) {
            var d = Date.now();
            var roomNumber = data.user._id + data.opponent[0]._id;
            var roomNumber2 = data.opponent[0]._id + data.user._id;

            // changing when room to connecting
            if (my_nps.adapter.rooms[roomNumber]) {
                socket.join(roomNumber, function () {
                    console.log('hi');
                });
                my_nps.to(roomNumber).emit('userMessageClient', {
                    idSender: data.user._id,
                    text    : data.text,
                    username: data.user.username,
                    date    : new Date(d),
                    img     : data.user.img
                });
            } else {
                socket.join(roomNumber2);

                my_nps.to(roomNumber2).emit('userMessageClient', {
                    idSender: data.user._id,
                    text    : data.text,
                    username: data.user.username,
                    date    : new Date(d),
                    img     : data.user.img
                });
            }
        });
    });

    //chat for all users
    io.on('connection', function (socket) {


        socket.on('status', function (text) {
            console.log('status = > ',text.text);
            socket.broadcast.emit('status', {
                userId  : text.user._id,
                username: text.user.username,
                text    : text.text,
                img     : text.user.img
            });
        });

        socket.on('message', function (text, cb) {

            UserDb.findById(text.user, function (err, user) {
                var d = Date.now();

                if (err) {
                    throw err
                }

                //callback for send message youself
                cb({
                    idSender: user._id,
                    text    : text.text,
                    username: user.username,
                    date    : new Date(d),
                    img     : user.img
                });

                //send message all users without youself
                socket.broadcast.emit('message', {
                    idSender: user._id,
                    text    : text.text,
                    username: user.username,
                    date    : new Date(d),
                    img     : user.img
                });
            });
        });
    });
};


