define([
    'Backbone',
    'Underscore',

    'helpers/counterMessages',

    'models/userMessage',
    'models/user',

    'collections/userMessages',

    'text!templates/chatWithUser.html'
], function (
    Backbone,
    _,

    counterMessages,

    UserMessage,
    UserPageModel,


    UserMessagesCol,

    temp
) {
    //var socketCorr = io('/my_namespace');


    var CorrespondenceView = Backbone.View.extend({
        el: '#containerHeaderBlock',
        onlineUsers: 0,

        initialize: function () {
            var self = this;
            var modelInstance = new UserPageModel({_id: this.model.get('opponent')});
            var $logOut = $('#signOutBut');
            //var $statusMessages;

            modelInstance.on('change', this.render, this);

            $logOut.click(function () {
                //if user leave correspondence than send data that user 'leaved' correspondence
                GLOBAL.socketCorrLocal.emit('userChatStatus', {
                    user: self.model.get('user'),
                    opponent: self.model.get('opponent'),
                    text: 'leaved'
                });
                //$statusMessages = $('.statusMessages h3');

                //$statusMessages.html('');
            });

            //listen event userMessageClient and send data on printing
            GLOBAL.socketCorrLocal.on('userMessageClient', function (data) {
                console.log('emit message');

                console.log('username1 => ', self.model.get('user').get('username'));
                console.log('username2 => ', data.username);
                /*
                //incrementing send message for opponent online
                if (self.model.get('user').get('username') !== data.username) {
                    counterMessages.incr(data.username);
                }
                */
                //send data on printing
                if (data.text) {
                    self.printMessage(data.username, data.text, data.date, data.img, data.idSender);
                }
            });

            //listen event 'userChatStatusClient' and change status
            GLOBAL.socketCorrLocal.on('userChatStatusClient', function (data) {
                var $statusConnection = $('#statusConnection');

                console.log('data status', data.status);

                //if user status 'connected' than change text on 'online(green)' and send opponent his status
                //if user status 'online' than change text on 'online(green)'
                //if user status 'leaved' than change text on 'offline(red)'
                if ((data.status === 'connected') && (data.username !== self.model.get('user').get('username'))){
                    $statusConnection.css({color: 'green'});
                    $statusConnection.html('online');

                    GLOBAL.socketCorrLocal.emit('userChatStatus', {
                        user: self.model.get('user'),
                        opponent: self.model.get('opponent'),
                        text: 'online'
                    });

                } else if ((data.status === 'online') && (data.username !== self.model.get('user').get('username'))) {
                    $statusConnection.css({color: 'green'});
                    $statusConnection.html('online');

                } else if (data.status === 'leaved') {
                    $statusConnection.css({color: 'red'});
                    $statusConnection.html('offline');
                }

                //if data is it than send data on the printing status
                if (data) {
                    self.printStatus(data.username, data.status);
                }
            });


            modelInstance.fetch();
        },

        events: {
            'click .sendInToCorrButton'        : 'sendMessage',
            'keypress #containerUpload2'       : 'sendMessage'
        },

        //function that printing status
        printStatus: function (user, text) {
            $('#showMessagesUser').prepend('<li>' + user + " is " + text + '</li><hr>')
        },

        //function that printing message
        printMessage: function (user, text, date, img) {
            $('#showMessagesUser').prepend('<li class = "messChat"><img class="chatImg" src="'+ img +'"><strong>' + user + '</strong><br><div class = "blockForChatText">' + text + '</div><br><h6>' + new Date(date).adecvatFormat() + '</h6><hr></li>');
        },

        //function that send message in the printing and saving in the db
        sendMessage: function (e) {
            var $editMessUser = $('#editMessUser');
            var text = $editMessUser.val();
            var newUserMesModel =  new UserMessage();

            //console.log('mess is send!');
            if (((e.target.className !== 'sendInToCorrButton') && (e.keyCode !== 13)) || (!$editMessUser.val().trim())) {
                return
            }


            //saving message in DB
            newUserMesModel.save({
                sender: {
                    user1: this.model.get('user').get('_id'),
                    user2: this.model.get('opponent')
                },
                textMessage: {
                    text: text,
                    opponent: this.model.get('opponent'),
                    user: this.model.get('user'),
                    date: new Date(Date.now)
                }
            }, {
                success: function (response) {
                    console.log('message is saved ', response.toJSON().text.text);
                },
                error: function () {
                    console.log('message isn`t saved');
                }
            });

            console.log('before send text = >', text);
            console.log('before send user = >', this.model.get('user').get('_id'));
            console.log('before send opponent = >', this.model.get('opponent'));

            //send message all users
            GLOBAL.socketCorrLocal.emit('userMessageServer', {
                text: text,
                opponent: this.model.get('opponent'),
                user: this.model.get('user')
            });


            $editMessUser.val('');
        },

        //function which react on the url action

        userIsNotActive: function () {
            var self = this;
            var $statusMessages;

            $(window).bind('hashchange', function () {

                GLOBAL.socketCorrLocal.off('userMessageClient');
                GLOBAL.socketCorrLocal.off('userChatStatusClient');

                console.log('i going to exit');

                //if user leave correspondence than send data that user 'leaved' correspondence

                GLOBAL.socketCorrLocal.emit('userChatStatus', {
                    user: self.model.get('user'),
                    opponent: self.model.get('opponent'),
                    text: 'leaved'
                });

                //$statusMessages = $('.statusMessages h3');

                //$statusMessages.html('');

                $(window).unbind('hashchange');
            });
        },


        //printing user messages from db
        renderUserMessages: function (messages) {
            console.log('response is here!');
            var self = this;
            var messagesColl = messages.toJSON().messages;

            messagesColl.forEach(function (mess) {
                self.printMessage(mess.user.username, mess.text, mess.date, mess.user.img, mess.user._id);
            });

            //sending status on server

            GLOBAL.socketCorrLocal.emit('userChatStatus', {
                user: this.model.get('user'),
                opponent: this.model.get('opponent'),
                text: 'connected'
            });

        },

        //fetching messages from db
        getMessages: function () {
            var userMessagesModelInstance = new UserMessage();

            userMessagesModelInstance.on('change', this.renderUserMessages, this);

            //get all messages this correspondence from DB
            userMessagesModelInstance.fetch({
                data: {
                    user1: this.model.get('user').get('_id'),
                    user2: this.model.get('opponent')
                },
                success: function (response) {
                    console.log('messages loaded is successfull!');
                },
                error: function () {
                    console.log('model is not fetched!');
                }
            });
        },

        render: function (htmlInform) {
            console.log(this);
            var opponentUsername = htmlInform.get('username');// = this.model.get('opponent')[0].get('username');
            var opponentImg = htmlInform.get('img');// = this.model.get('opponent')[0].get('img');


            this.$el.html('').show().append(_.template(temp)({
                username: opponentUsername,
                img: opponentImg
            }));

            this.getMessages();

            this.userIsNotActive();

            return this;
        }
    });

    return CorrespondenceView;
});