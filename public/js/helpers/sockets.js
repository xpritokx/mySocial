define([
    'helpers/currModel',
    'helpers/counterMessages'
], function (
    currModel,
    counterMessages
){
    function initGlobalChat() {
        currModel(function (currentUserModel) {
            var $statusMessages;

            var $logOut = $('#signOutBut');

            if (currentUserModel) {
                var modelForGetMessageDataCount = new Backbone.Model({_id: currentUserModel.get('username')});

                modelForGetMessageDataCount.once('change', function(data) {

                    GLOBAL.counterMessages = data.get('data');
                    GLOBAL.listInvites = data.get('invites');

                    counterMessages.render(currentUserModel.get('username'), currentUserModel);
                }, this);

                modelForGetMessageDataCount.urlRoot = '/countMess/';
                modelForGetMessageDataCount.fetch();


                GLOBAL.socketCorr.emit('joinToFriendsRooms',{
                    userId: currentUserModel.get('_id'),
                    friends: currentUserModel.get('friends'),
                    text: 'entered',
                    user: {
                        username: currentUserModel.get('username')
                    }
                });

                GLOBAL.socketCorr.on('messageManager', function(data) {
                    console.log('mess manager => ', data.user);

                    if (currentUserModel.get('username') !== data.user) {
                        console.log('userId ++', data.user);
                        console.log('opponentId ++', data.opponent);

                        counterMessages.incr(data.user, currentUserModel);
                    } else {
                        console.log('userId --', data.user);
                        console.log('opponentId --', data.opponent);

                        counterMessages.decr(data.opponent ,currentUserModel);
                    }
                });

                $logOut.click(function () {

                    //if user leave correspondence than send data that user 'leaved' correspondence
                    GLOBAL.socketCorr.emit('joinToFriendsRooms',{
                        userId: currentUserModel.get('_id'),
                        friends: currentUserModel.get('friends'),
                        text: 'escaped',
                        user: {
                            username: currentUserModel.get('username')
                        }
                    });

                    $statusMessages = $('.statusMessages h3');

                    $statusMessages.html('');
                });
            }
        });
    }

    return initGlobalChat
});

