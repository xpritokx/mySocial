define([
    'Backbone',
    'Underscore',

    'models/chatMessage',

    'collections/friend',
    'collections/chatMessages',

    'views/friends/form',

    'text!templates/chatPage.html'
], function (
    Backbone,
    _,

    ChatMessage,

    FriendsColl,
    ChatMessagesCol,

    FriendsView,

    temp
) {
    var socket = io.connect();

    var ChatView = Backbone.View.extend({
        el: '#containerHeaderBlock',
        initialize: function() {
            var self = this;
            var $logOut = $('#signOutBut');
            var friendsColInstance;
            $logOut.click(function () {
                self.sendStatus('leaved');
            });

            //waiting on the message and printing
            socket.on('message', function (data) {
                console.log('emit message');

                if (data.text) {
                    self.printMessage(data.username, data.text, data.date, data.img, data.idSender);
                }
            });

            //waiting on event 'status' and send data on printing
            socket.on('status', function (data) {
                var $usersOnline = $('.usersOnline');

                //if status equal 'leaved' and this user in friend than send data on printing and remove his image with online users
                if ((data.text === 'leaved') && self.isFriend(data.userId)) {
                    self.printStatus(data.username, data.text);
                    $('.' + data.userId).remove();
                }

                //if status equal 'connect' and this user in friend than send data on printing and adding his image in online users
                if ((data.text === 'connect') && self.isFriend(data.userId)) {
                    $('.' + data.userId).remove();
                    $usersOnline.append('<img src="'+ data.img +'" class= "' + data.userId + '" style="width:20px;height:20px">');
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

            friendsColInstance = new FriendsColl();

            friendsColInstance.on('reset', self.render, self);

            friendsColInstance.fetch({reset: true});
            //this.render();
        },

        //function which react on the url action
        userIsNotActive: function () {
            var self = this;

            //if user leave chat than send data that user 'leaved' chat
            $(window).bind('hashchange', function () {

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
            var $showMessages = $('#showMessages');
            console.log('i printing status', user, text);

            $showMessages.prepend('<li>' + user + ' is ' + text + '<hr></li>');
        },

        //printing message on the display
        printMessage: function (user, text, date, img, idSender) {
            var userNameCurr = this.model.get('username');
            var userStatus = this.model.get('admin');
            var $showMessages = $('#showMessages');

            //admin can see all messages
            if (userStatus) {
                $showMessages.prepend('<li class = "messChat"><img class="chatImg" src="'+ img +'"><strong>' + user + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + new Date(date).adecvatFormat() + '</h6><hr></li>')
            } else if (this.isFriend(idSender) || (userNameCurr === user)) {
                $showMessages.prepend('<li class = "messChat"><img class="chatImg" src="'+ img +'"><strong>' + user + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + new Date(date).adecvatFormat() + '</h6><hr></li>')
            }
        },

        //sending status on server and printing status for user
        sendStatus: function (text) {
            var $usersOnline = $('.usersOnline');

            //binding method which see user on chat
            this.userIsNotActive();

            socket.emit('status', {
                text: text,
                user: this.model
            }, function (data) {
                if (data) {
                    data.online.forEach(function (img) {
                        $usersOnline.append('<img src="'+ img.img +'" class= "' + img.userId + '" style="width: 20px; height: 20px">');
                    });
                }
            });
        },

        //send message in to db
        sendMessage: function (e) {
            var $editMess = $('#editMess');
            var $showMessages = $('#showMessages');
            var text = $editMess.val();
            var newMesModel =  new ChatMessage();

            if (((e.target.className !== 'sendInToChatButton') && (e.keyCode !== 13)) || (!$editMess.val().trim())) {
                return
            }

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
                $showMessages.prepend('<li class = "messChat"><img class="chatImg" src="'+ data.img +'"><strong>' + data.username + '</strong><br><div class = "blockForChatText">' + data.text + '</div><br><h6>' + new Date(data.date).adecvatFormat() + '</h6><hr></li>')
            });

            $editMess.val('');

            return false;
        },

        //deleting message
        deleteMessage: function (e) {
            var modelForDelete;

            if (e.target.id) {

                //delete message with chat by id
                modelForDelete = new ChatMessage({_id: e.target.id});

                modelForDelete.destroy({
                    success: function() {
                        $('#' + e.target.id).hide(2000, function () {
                            $('#' + e.target.id).remove();
                        });
                    },

                    error: function () {
                        console.log('message delete error!');
                    }
                });

            }
        },

        //checking user on the friends
        isFriend: function (friendId) {
            var masFriends = this.model.get('friends');

            return masFriends.indexOf(friendId) >= 0;
        },

        //printing messages on display from db
        renderMessagesWhichGet: function (messCol) {
            var self = this;
            var idCurrUser = self.model.get('_id');
            var userStatus = self.model.get('admin');
            var userNameCurr = self.model.get('username');

            messCol.forEach(function (message) {
                var senderImg = message.get('sender').img;
                var senderName = message.get('sender').senderName;
                var senderId = message.get('sender').senderId;
                var text = message.get('textMessage');
                var date = message.get('date');
                var id = message.get('_id');
                var $showMessages = $('#showMessages');

                //admin can see messages all users
                if (userStatus) {
                    $showMessages.prepend('<li class = "messChat" id="' + id + '"><img class="chatImg" src="'+ senderImg +'"><strong>' + senderName + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + new Date(date).adecvatFormat() + '</h6><hr></li>')
                } else if (self.isFriend(senderId) || (senderId === idCurrUser)) {
                    $showMessages.prepend('<li class = "messChat" id="' + id + '"><img class="chatImg" src="'+ senderImg +'"><strong>' + senderName + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + new Date(date).adecvatFormat() + '</h6><hr></li>')
                }
            });
        },

        //creating collection and fetching messages
        getMessages: function () {
            var chatMessagesColInstance = new ChatMessagesCol();

            chatMessagesColInstance.on('reset', this.renderMessagesWhichGet, this);

            chatMessagesColInstance.fetch({reset: true});
        },

        render: function () {
            //console.log('el = >', this.el);

            this.$el.html('').show().append(_.template(temp));

            this.sendStatus('connect');
            this.getMessages();

            return this;
        }
    });

    return ChatView;
});