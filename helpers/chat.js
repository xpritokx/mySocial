var UserDb = require('../models/user').User;
var mongoose = require('mongoose');

module.exports = function (server) {
    var io = require('socket.io')(server);

    //creating namespace
    var my_nps = io.of('/my_namespace');

    var my_nps_local = io.of('/my_local_chat');

    var  online = [];

    //setting filter on domens
    io.set('origins', 'localhost:8088');







    my_nps_local.on('connection', function (socket) {

        //emitting userChatStatus event on Server
        function emitRequest (username, status, roomNumber, event) {
            if (status !== 'online') {
                if (event) {
                    socket.join(roomNumber);
                } else {
                    socket.leave(roomNumber);
                }
            }

            console.log('printing local status ', status);

            my_nps_local.to(roomNumber).emit('userChatStatusClient', {
                username: username,
                status: status
            });
        }

        //if text => leaved that user exit with room else not user enter to room
        //if text => online that signaling opponent that user is online
        function checkRooms(data, roomNumber, roomNumber2) {
            if (data.text === 'leaved') {
                console.log('user is leaved');

                if (my_nps_local.adapter.rooms[roomNumber]) {
                    console.log('room Number1 = > ', roomNumber);
                    emitRequest(data.user.username, 'leaved', roomNumber, false);
                } else {
                    console.log('room Number2 => ', roomNumber2);
                    emitRequest(data.user.username, 'leaved', roomNumber2, false);
                }

            } else if (data.text === 'online') {
                console.log('user is online in chat');

                if (my_nps_local.adapter.rooms[roomNumber]) {
                    console.log('room Number1 = > ', roomNumber);
                    emitRequest(data.user.username, 'online', roomNumber);
                } else {
                    console.log('room Number2 => ', roomNumber2);
                    emitRequest(data.user.username, 'online', roomNumber2);
                }

            } else {
                console.log('user is connected to chat');

                if (my_nps_local.adapter.rooms[roomNumber]) {
                    console.log('room Number1 = > ', roomNumber);

                    emitRequest(data.user.username, 'connected', roomNumber, true);
                } else {
                    console.log('room Number2 => ', roomNumber2);

                    emitRequest(data.user.username, 'connected', roomNumber2, true);
                }
            }
        }


        //waiting message on event 'userChatStatus' for enter or exit with room
        socket.on('userChatStatus', function (data) {

            var roomNumber = data.user._id + data.opponent;
            var roomNumber2 = data.opponent + data.user._id;

            console.log('message come to printing status');

            console.log('user id = > ', data.user._id);
            console.log('opponent id => ', data.opponent);


            //console.log(socket);

            checkRooms(data, roomNumber, roomNumber2)

        });



        //checking message with client
        socket.on('userMessageServer', function (data) {
            var d = Date.now();
            var roomNumber = data.user._id + data.opponent;
            var roomNumber2 = data.opponent + data.user._id;

            console.log('local');

            console.log('user id = > ', data.user._id);
            console.log('opponent id => ', data.opponent);

            console.log('room Number1 = > ', roomNumber);
            console.log('room Number2 => ', roomNumber2);



            if (my_nps_local.adapter.rooms[roomNumber]) {

                my_nps_local.to(roomNumber).emit('userMessageClient', {
                    idSender: data.user._id,
                    text    : data.text,
                    username: data.user.username,
                    date    : new Date(d),
                    img     : data.user.img
                });
            } else {

                my_nps_local.to(roomNumber2).emit('userMessageClient', {
                    idSender: data.user._id,
                    text    : data.text,
                    username: data.user.username,
                    date    : new Date(d),
                    img     : data.user.img
                });
            }


            UserDb.findById(data.opponent, function(err, user) {
                if (my_nps.adapter.rooms[roomNumber]) {
                    //socket.join(roomNumber);

                    my_nps.to(roomNumber).emit('messageManager', {
                        user: data.user.username,
                        opponent: user.username
                    });
                } else {
                    //socket.join(roomNumber2);

                    my_nps.to(roomNumber2).emit('messageManager', {
                        user: data.user.username,
                        opponent: user.username
                    });
                }
            });


        });


    });




















    //event onConnection
     my_nps.on('connection', function (socket) {


        //emitting userChatStatus event on Server
        function emitRequest (username, status, roomNumber, event) {
            if (event) {
                socket.join(roomNumber);
            } else {
                socket.leave(roomNumber);
            }

            console.log('printing global status ', status);

            my_nps_local.to(roomNumber).emit('userChatStatusClient', {
                username: username,
                status: status
            });
        }

        //if text => leaved that user exit with room else not user enter to room
        //if text => online that signaling opponent that user is online
        function checkRooms(data, roomNumber, roomNumber2) {
            if (data.text === 'escaped') {
                console.log('user is escaped');

                if (my_nps.adapter.rooms[roomNumber]) {
                    console.log('room Number1 = > ', roomNumber);
                    emitRequest(data.user.username, 'escaped', roomNumber, false);
                } else {
                    console.log('room Number2 => ', roomNumber2);
                    emitRequest(data.user.username, 'escaped', roomNumber2, false);
                }

            } else {
                console.log('user is entered to chat');

                if (my_nps.adapter.rooms[roomNumber]) {
                    console.log('room Number1 = > ', roomNumber);

                    emitRequest(data.user.username, 'entered', roomNumber, true);
                } else {
                    console.log('room Number2 => ', roomNumber2);

                    emitRequest(data.user.username, 'entered', roomNumber2, true);
                }
            }
        }
        /*
        socket.on('applyToFriends', function(data) {
            my_nps.emit('applyToFriendsClient', {
                data: data
            });
        });
        */
        socket.on('joinToFriendsRooms', function (data) {
            var i = 0;
            var roomNumber;
            var roomNumber2;

            console.log('join data = >', data.text);

            if (data.friends.length) {
                for (i; i < data.friends.length; i++) {
                    roomNumber = data.userId + data.friends[i];
                    roomNumber2 = data.friends[i] + data.userId;

                    checkRooms(data, roomNumber, roomNumber2);
                }
            }
        });



    });

















    //chat for all users
    io.on('connection', function (socket) {

        socket.on('status', function (text, cb) {
            var imagePosition;

            console.log('status = > ',text.text);

            //function finding index image in array online users
            function indexOfObject (mas, img){
                var  i;
                for (i = 0; i < mas.length; i++) {
                    if (mas[i].img === img) {
                        return i
                    }
                }
                return -1;
            }

            imagePosition = indexOfObject(online, text.user.img);

            console.log('pos image = > ', imagePosition);

            //pushing and delete images for online/offline users
            if (text.text === 'connect') {
                if (imagePosition < 0) {
                    online.push({
                        img: text.user.img,
                        userId : text.user._id
                    });
                }
                
                //callback for self status
                cb({
                    online : online
                });
            } else {
                console.log('online to ', online);
                if (imagePosition >= 0) {
                    online.splice(imagePosition, 1);
                }
                console.log('online do ', online);
            }

            //emitting event about status user on chat
            socket.broadcast.emit('status', {
                userId  : text.user._id,
                username: text.user.username,
                text    : text.text,
                img     : text.user.img
            });
        });

        //socket listen message event
        socket.on('message', function (text, cb) {

            UserDb.findById(text.user, function (err, user) {
                var d = Date.now();

                if (err) {
                    throw err
                }

                //callback message for self
                cb({
                    idSender: user._id,
                    text    : text.text,
                    username: user.username,
                    date    : new Date(d),
                    img     : user.img
                });

                //send message all users without self
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


