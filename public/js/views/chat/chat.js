/**
 * Created by Pritok on 07.03.2016.
 */
define([
    'Backbone',
    'Underscore',

    'models/login',
    'models/chatMessage',

    'collections/chatMessages',

    'text!templates/chatPage.html'
], function (
    Backbone,
    _,

    UserLogModel,
    ChatMessage,

    ChatMessagesCol,

    temp
) {
    //var socket;
    var socket = io.connect();

    var ChatView = Backbone.View.extend({
        el: '#containerHeaderBlock',
        initialize: function() {
            var self = this;

            //waiting on the message and printing
            socket.on('message', function (data) {
                console.log('emit message');
                if (data.text) {
                    self.printMessage(data.username, data.text, data.date, data.img, data.idSender);
                }
            });

            //waiting on the message and printing
            socket.on('status', function (data) {
                console.log('emit status');
                if ((data.text === 'leaved') && self.isFriend(data.userId)) {
                    //console.log('user ', data.userId, 'is ', data.text);
                    self.printStatus(data.username, data.text);
                    $('.' + data.userId).remove();
                }
                if ((data.text === 'connect') && self.isFriend(data.userId)) {
                    console.log('deleting and appending!  ', data.username);
                    $('.' + data.userId).remove();
                    $('.usersOnline').append('<img src="'+ data.img +'" class= "' + data.userId + '" style="width: 20px; height: 20px">');
                    self.printStatus(data.username, data.text);
                }

            });

            //socket waiting on event 'connect'
            socket.on('connect', function () {
                console.log('CHAT connection is setting!');

                self.printStatus(self.model.get('username') ,'connection');

            });

            //socket listen on event 'connect'
            socket.on('disconnect', function () {
                console.log('CHAT connection is lost');

                self.printStatus(self.model.get('username'), 'connection is lost');
            });

            this.render();
        },

        userIsNotActive: function () {
            var self = this;

            //console.log('so what???!1!', self.model.get('username'));

            $(window).bind('hashchange', function () {

                //self.printStatus(self.model.get('username'), 'leaved');

                self.sendStatus('leaved');


                $(window).unbind('hashchange');
            });
        },

        events: {
            'click .sendInToChatButton'        : 'sendMessage',
            'keypress #containerUpload2'       : 'sendMessage',
            'dblclick .messChat'               : 'deleteMessage'
        },

        //printing status of connection
        printStatus: function (user, text) {
            console.log('i printing status', user, text);
            $('#showMessages').prepend('<li>' + user + ' is ' + text + '<hr></li>');
        },

        //printing message on the display
        printMessage: function (user, text, date, img, idSender) {
            var userNameCurr = this.model.get('username');

            if (userNameCurr === 'admin') {
                $('#showMessages').prepend('<li class = "messChat"><img class="chatImg" src="'+ img +'"><strong>' + user + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + new Date(date).adecvatFormat() + '</h6><hr></li>')
            } else if (this.isFriend(idSender) || (userNameCurr === user)) {
                $('#showMessages').prepend('<li class = "messChat"><img class="chatImg" src="'+ img +'"><strong>' + user + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + new Date(date).adecvatFormat() + '</h6><hr></li>')
            }
        },


        sendStatus: function (text) {
            this.userIsNotActive();
            //console.log('i sending status');
            socket.emit('status', {
                text: text,
                user: this.model
            });

        },

        //send message in to db
        sendMessage: function (e) {
            if (((e.target.className !== 'sendInToChatButton') && (e.keyCode !== 13)) || (!$('#editMess').val().trim())) {
                return
            }

            var text = $('#editMess').val();
            var newMesModel =  new ChatMessage();

            //send data in to db
            newMesModel.save({
                sender: {
                    senderId   : this.model.get('_id'),
                    senderName : this.model.get('username'),
                    img        : this.model.get('img')
                },
                textMessage: text
            }, {
                success: function () {
                    console.log('message is saved');
                },
                error: function () {
                    console.log('message isn`t saved');
                }
            });

            //emitting event message (send message in server and receive callback adn printing)
            socket.emit('message', {
                text: text,
                user: this.model
            }, function (data) {
                $('#showMessages').prepend('<li class = "messChat"><img class="chatImg" src="'+ data.img +'"><strong>' + data.username + '</strong><br><div class = "blockForChatText">' + data.text + '</div><br><h6>' + new Date(data.date).adecvatFormat() + '</h6><hr></li>')
            });

            $('#editMess').val('');
            return false;
        },

        //deleting message
        deleteMessage: function (e) {
            if (this.model.get('username') === 'admin') {
                if (e.target.id) {
                    var modelForDelete = new ChatMessage({_id: e.target.id});
                    modelForDelete.destroy({
                        success: function() {
                            $('#' + e.target.id).remove();
                        },
                        error: function () {
                            console.log('message delete error!');
                        }
                    });
                }
            }
        },

        //checking user on the friends
        isFriend: function (friendId) {
            var i = 0;
            var masFriends = this.model.get('friends');
            for (i; i < masFriends.length; i++) {
                if (masFriends[i] === friendId) {
                    return true
                }
            }
            return false
        },

        //printing messages on display from db
        renderMessagesWhichGet: function (messCol) {
            var self = this;
            var idCurrUser = self.model.get('_id');
            var userNameCurr = self.model.get('username');


            messCol.forEach(function (message) {
                var senderImg = message.get('sender').img;
                var senderName = message.get('sender').senderName;
                var senderId = message.get('sender').senderId;
                var text = message.get('textMessage');
                var date = message.get('date');
                var id = message.get('_id');

                if (userNameCurr == 'admin') {
                    $('#showMessages').prepend('<li class = "messChat" id="' + id + '"><img class="chatImg" src="'+ senderImg +'"><strong>' + senderName + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + new Date(date).adecvatFormat() + '</h6><hr></li>')
                } else if (self.isFriend(senderId) || (senderId === idCurrUser)) {
                    $('#showMessages').prepend('<li class = "messChat" id="' + id + '"><img class="chatImg" src="'+ senderImg +'"><strong>' + senderName + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + new Date(date).adecvatFormat() + '</h6><hr></li>')
                }
            });
        },

        //creating collection and fetching messages
        getMessages: function () {
            var chatMessagesColInstance = new ChatMessagesCol();

            chatMessagesColInstance.on('reset', this.renderMessagesWhichGet, this);

            chatMessagesColInstance.fetch({
                reset  : true
            });
        },

        render: function () {
            this.$el.html('').show().append(_.template(temp));

            //fetching friend collection
            GLOBAL.getFriendsInstance().getDataToCollection();

            this.sendStatus('connect');
            this.getMessages();


        }
    });

    return ChatView;
});