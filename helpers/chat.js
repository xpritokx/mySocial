/**
 * Created by Pritok on 29.02.2016.
 */
var UserDb = require('../models/user').User;
var mongoose = require('mongoose');

module.exports = function(server){
    var io = require('socket.io')(server);

//setting filter on domens
    io.set('origins', 'localhost:8088');

    io.on('connection', function(socket) {
        console.log('socket.io in connection');
        //socket.leave();

        socket.on('message', function(text) {
            console.log('soso = ', text);
            UserDb.findById(text.userId, function(err, user){
                if (user) {
                    socket.broadcast.emit('message', {
                        username: user.username,
                        text: text.text
                    });
                }
            });

        })
    });
};


