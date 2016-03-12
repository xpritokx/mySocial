/**
 * Created by Pritok on 29.02.2016.
 */
var UserDb = require('../models/user').User;
var mongoose = require('mongoose');

module.exports = function(server){
    var io = require('socket.io')(server);

    //setting filter on domens
    io.set('origins', 'localhost:8088');

    var my_nps = io.of('/my_namespace');

    my_nps.on('connection', function(socket) {

        socket.on('userChatStatus', function (data) {
            console.log('printing user status');
            var roomNumber = data.user._id + data.opponent[0]._id;
            var roomNumber2 = data.opponent[0]._id + data.user._id;

            if (data.text === 'leaved') {
                console.log('leaved');
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




        socket.on('userMessageServer', function(data) {
            console.log('someone connected to nsp');
            //console.dir('text', data);
            var d = Date.now();
            var roomNumber = data.user._id + data.opponent[0]._id;
            var roomNumber2 = data.opponent[0]._id + data.user._id;

            //console.log('room Number', roomNumber);

            /*
             cb({
             idSender: user._id,
             text    : data.text,
             username: user.username,
             date    : new Date(d),
             img     : user.img
             });
             */
            //console.log(socket.rooms);
            //console.dir(my_nps.adapter.rooms);

            if (my_nps.adapter.rooms[roomNumber]) {
                socket.join(roomNumber, function() {
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

    io.on('connection', function (socket) {
        console.info('New client connected (id=' + socket.id + ').');

        socket.on('message', function (text, cb) {
            console.log('text ', text);

            UserDb.findById(text.user, function(err, user) {
                var d = Date.now();
                console.log(user);
                if (err) {
                    throw err
                }
                cb({
                    idSender: user._id,
                    text    : text.text,
                    username: user.username,
                    date    : new Date(d),
                    img     : user.img
                });

                //console.log(formatDate(Date.now()));
                socket.broadcast.emit('message', {
                    idSender: user._id,
                    text    : text.text,
                    username: user.username,
                    date    : new Date(d),
                    img     : user.img
            });
            });


        });

        socket.on('disconnect', function () {
            console.info('Client gone (id=' + socket._id + ').');
        });
    });
};


