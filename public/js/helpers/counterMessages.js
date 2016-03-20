define([
    'Backbone',
    'Underscore',
], function (
    Backbone,
    _
) {
    var counterMessages = {

        //summing and output all messages all users
        render: function (user, currentUserModel) {
            var count_messages = 0;
            var $statusMessagesSpan = $('.tool.anim');
            var outputToDisplay = '';

            var modelForSaveCount = new Backbone.Model({_id: currentUserModel.get('username')});


            modelForSaveCount.once('change', function(data) {
                console.log('data counter is saved!');
            }, this);

            modelForSaveCount.urlRoot = '/countMess/';

            modelForSaveCount.save({data: GLOBAL.counterMessages, opponent: user});

            console.log('counter messages render!', GLOBAL.counterMessages);

            for (user in GLOBAL.counterMessages) {
                console.log('counter messages user!', GLOBAL.counterMessages[user]);
                count_messages += GLOBAL.counterMessages[user];
                outputToDisplay += user + ' (' + GLOBAL.counterMessages[user] + ') <br>';
            }

            console.log('count Messages => ', count_messages);
            $statusMessagesSpan.html(count_messages + '<p>' + outputToDisplay + '</p>');

        },

        //each message which sent of user, incrementing message counter +1
        incr: function (user, currentUserModel) {
            console.log('counter messages incr!', user);

            if (GLOBAL.counterMessages[user]) {
                GLOBAL.counterMessages[user]++;
            } else {
                GLOBAL.counterMessages[user] = 0;
                GLOBAL.counterMessages[user]++;
            }

            this.render(user,currentUserModel);
        },

        //if user send message that his message counter equal 0
        decr: function (user, currentUserModel) {
            console.log('counter messages decr!', user);

            GLOBAL.counterMessages[user] = 0;

            this.render(user, currentUserModel);
        }
    };

    return counterMessages
});