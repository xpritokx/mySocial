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
    var socket = io.connect();

    var ChatView = Backbone.View.extend({
        el: '#containerHeaderBlock',
        initialize: function() {
            var self = this;

            /*socket = io.connect('', {
                //'reconnection delay': 1
            });*/
            socket.on('message', function (data) {
                console.log('emit message');
                if (data.text) {
                    self.printMessage(data.username, data.text, data.date, data.img, data.idSender);
                }
            });
            socket.on('connect', function () {
                console.log('CHAT connection is setting');

                self.printStatus(self.model.get('username') ,'connection');
            });
            socket.on('disconnect', function () {
                console.log('CHAT connection is lost');

                self.printStatus('connection is lost');
            });

            //console.log('sock = ', socket);


            this.render();
        },
        events: {
            'click .sendInToChatButton'        : 'sendMessage',
            'keypress #containerUpload2'       : 'sendMessage',
            'dblclick .messChat'               : 'deleteMessage'
        },
        printStatus: function(user, text) {
            console.log('printing messages', user, ', ', text);
            $('#showMessages').prepend('<li>' + user + " is " + text + '</li>')
        },
        printMessage: function(user, text, date, img, idSender) {
            var userNameCurr = this.model.get('username');
            console.log('printing messages', user, ', ', text);
            console.log('id Sender', idSender);

            if (userNameCurr === 'admin') {
                $('#showMessages').prepend('<li class = "messChat"><img class="chatImg" src="'+ img +'"><strong>' + user + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + date + '</h6><hr></li>')
            } else if (this.isFriend(idSender) || (userNameCurr === user)) {
                $('#showMessages').prepend('<li class = "messChat"><img class="chatImg" src="'+ img +'"><strong>' + user + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + date + '</h6><hr></li>')
            }
        },
        sendMessage: function (e) {
            if (((e.target.className !== 'sendInToChatButton') && (e.keyCode !== 13)) || (!$('#editMess').val().trim())) {
                return
            }

            var text = $('#editMess').val();
            var newMesModel =  new ChatMessage();

            console.log('text = ', text);
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

            socket.emit('message', {
                text: text,
                user: this.model
            }, function (data) {
                $('#showMessages').prepend('<li class = "messChat"><img class="chatImg" src="'+ data.img +'"><strong>' + data.username + '</strong><br><div class = "blockForChatText">' + data.text + '</div><br><h6>' + data.date + '</h6><hr></li>')
            });
            //socket.send({text: text});
            $('#editMess').val('');
            return false;
        },
        deleteMessage: function (e) {
            if (this.model.get('username') === 'admin') {
                //console.log(e);
                if (e.target.id) {
                    console.log('id =', e.target.id);
                    var modelForDelete = new ChatMessage({_id: e.target.id});
                    //console.log(modelForDelete);
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
        isFriend: function(friendId) {
            var i = 0;
            var masFriends = this.model.get('friends');
            for (i; i < masFriends.length; i++){
                if (masFriends[i] === friendId) {
                    return true
                }
            }
            return false
        },

        renderMessagesWhichGet: function (messCol) {
            var self = this;
            var idCurrUser = self.model.get('_id');
            var userNameCurr = self.model.get('username');

            console.log('reset is work!');
            messCol.forEach(function (message) {
                //console.log(message);
                var senderImg = message.get('sender').img;
                var senderName = message.get('sender').senderName;
                var senderId = message.get('sender').senderId;
                var text = message.get('textMessage');
                var date = message.get('date');
                var id = message.get('_id');

                if (userNameCurr == 'admin') {
                    $('#showMessages').prepend('<li class = "messChat" id="' + id + '"><img class="chatImg" src="'+ senderImg +'"><strong>' + senderName + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + date + '</h6><hr></li>')
                } else if (self.isFriend(senderId) || (senderId === idCurrUser)) {
                    $('#showMessages').prepend('<li class = "messChat" id="' + id + '"><img class="chatImg" src="'+ senderImg +'"><strong>' + senderName + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + date + '</h6><hr></li>')
                }
            })
        },

        getMessages: function() {
            var chatMessagesColInstance = new ChatMessagesCol();

            chatMessagesColInstance.on('reset', this.renderMessagesWhichGet, this);

            chatMessagesColInstance.fetch({
                reset  : true
            });
        },

        render: function () {

            this.$el.html('').show().append(_.template(temp));

            GLOBAL.getFriendsInstance().getDataToCollection();

            this.getMessages();

        }
    });

    return ChatView;
});