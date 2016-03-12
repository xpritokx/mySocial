/**
 * Created by Pritok on 11.03.2016.
 */
define([
    'Backbone',
    'Underscore',

    'models/login',
    'models/userMessage',

    'collections/userMessages',

    'text!templates/chatWithUser.html'
], function (
    Backbone,
    _,

    UserLogModel,
    UserMessage,

    UserMessagesCol,

    temp
) {
    var socketCorr = io('/my_namespace');


    var CorrespondenceView = Backbone.View.extend({
        el: '#containerHeaderBlock',
        initialize: function() {
            var self = this;

            socketCorr.on('userMessageClient', function (data) {
                console.log('emit message');
                if (data.text) {
                    self.printMessage(data.username, data.text, data.date, data.img, data.idSender);
                }
            });
            socketCorr.on('userChatStatusClient', function (data) {
                console.log('emit message');
                if (data) {
                    console.log('printing status=)');
                    self.printStatus(data.username, data.status);
                }
            });
            socketCorr.on('connect', function () {
                console.log('CHAT connection is setting');

                self.printStatus(self.model.get('user').get('username') ,'connection');
            });
            /*
            socketCorr.on('disconnect', function () {
                console.log('CHAT connection is lost');

                self.printStatus('connection is lost');
            });
            */
            //console.log('sock = ', socketCorr);
            this.render();
        },

        events: {
            'click .sendInToCorrButton'        : 'sendMessage',
            'keypress #containerUpload2'       : 'sendMessage'
        },

        printStatus: function(user, text) {
            console.log('printing messages', user, ', ', text);
            $('#showMessagesUser').prepend('<li>' + user + " is " + text + '</li><hr>')
        },
        printMessage: function(user, text, date, img, idSender) {
            console.log('im printing!');
            console.log('printing messages', user, ', ', text);
            console.log('id Sender', idSender);
            $('#showMessagesUser').prepend('<li class = "messChat"><img class="chatImg" src="'+ img +'"><strong>' + user + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + date + '</h6><hr></li>');
        },
        sendMessage: function (e) {
            console.log('mess is send!');
            if (((e.target.className !== 'sendInToCorrButton') && (e.keyCode !== 13)) || (!$('#editMessUser').val().trim())) {
                return
            }
            console.log('im passed!');

            var text = $('#editMessUser').val();

            var newUserMesModel =  new UserMessage();

            console.log('text = ', text);
            newUserMesModel.save({
                sender: {
                    user1: this.model.get('user').get('_id'),
                    user2: this.model.get('opponent')[0].get('_id')
                },
                textMessage: {
                    text: text,
                    opponent: this.model.get('opponent'),
                    user: this.model.get('user'),
                    date: Date(Date.now)
                }
            }, {
                success: function () {
                    console.log('message is saved');
                },
                error: function () {
                    console.log('message isn`t saved');
                }
            });

            socketCorr.emit('userMessageServer', {
                text: text,
                opponent: this.model.get('opponent'),
                user: this.model.get('user')
            });
            $('#editMessUser').val('');
        },

        userIsNotActive: function () {
            var self = this;

            $(window).bind('hashchange', function() {
                socketCorr.emit('userChatStatus', {
                    user: self.model.get('user'),
                    opponent: self.model.get('opponent'),
                    text: 'leaved'
                });
                $(window).unbind('hashchange');
            });
        },

        renderUserMessages: function (messages) {
            console.log('response is here!');
            var self = this;
            var messagesColl = messages.toJSON().messages;

            messagesColl.forEach(function (mess) {
                console.log(mess);
                self.printMessage(mess.user.username, mess.text, mess.date, mess.user.img, mess.user._id);
            })
        },

        getMessages: function () {
            var userMessagesModelInstance = new UserMessage();

            userMessagesModelInstance.on('change', this.renderUserMessages, this);

            //userMessagesModelInstance.set({user1: this.model.get('user').get('_id')});
            //userMessagesModelInstance.set({user2: this.model.get('opponent')[0].get('_id')});
            //userMessagesModelInstance.on('reset', this.renderUserMessages, this);
            //console.log('userMessagesModelInstance', userMessagesModelInstance);
            userMessagesModelInstance.fetch({
                data: {
                    user1: this.model.get('user').get('_id'),
                    user2: this.model.get('opponent')[0].get('_id')
                },
                success: function (response) {
                    console.log('messages loaded is successfull!');
                },
                error: function () {
                    console.log('model is not fetched!');
                }
            });


        },

        render: function () {
            var opponentUsername = this.model.get('opponent')[0].get('username');
            var opponentImg = this.model.get('opponent')[0].get('img');


            this.$el.html('').show().append(_.template(temp)({
                username: opponentUsername,
                img: opponentImg
            }));

            socketCorr.emit('userChatStatus', {
                user: this.model.get('user'),
                opponent: this.model.get('opponent'),
                text: 'connected'
            });

            this.getMessages();

            this.userIsNotActive();
            //this.printStatus(this.model.get('user').get('username'), ' connected');
        }
    });

    return CorrespondenceView;
});