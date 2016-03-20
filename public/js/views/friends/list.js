define([
    'Backbone',
    'Underscore',
    'models/friend',

    'helpers/showUpdateButton',

    'text!templates/updateUserInfoPage.html',
    'text!templates/friendPage.html'
], function (
    Backbone,
    _,
    FriendModel,

    showUpdateButton,

    tempUpdateUser,
    tempUser
) {
    var NewFriendPageView = Backbone.View.extend({

        template: _.template(tempUser),

        initialize: function () {

            this.model.on('destroy', function () {
                this.remove();
                showUpdateButton();
            }, this);

            this.on('fromFriendDelete', function () {
                this.remove();
            }, this);


        },

        events: {
            'click .butKick'                   : 'kickUserFromFriends',
            'click .butWrite'                  : 'redirectToCorrespondence'
        },

        //action when user clicked on the 'WRITE' button
        redirectToCorrespondence: function () {
            GLOBAL.router.navigate('#correspondence/' + this.model.get('_id'), {trigger: true});
        },

        //deleting user from friends
        kickUserFromFriends: function () {
            var self = this;
            var kickModel = this.model;
            var posKickedUser;

            kickModel.urlRoot = function () {
                return '/friends/'
            };
            console.log('del for friends! ', this.model.get('username'));

            posKickedUser = GLOBAL.listInvites.indexOf(this.model.get('_id'));

            if (posKickedUser >= 0) {
                GLOBAL.listInvites.splice(posKickedUser, 1);
            }

            kickModel.save(null, {
                success: function (response) {
                    var $butMini = $('.butMini');
                    var $butWrite = $('.butWrite');
                    var $butKick = $('.butKick');

                    console.log('response Kick! ', response.toJSON());

                    //GLOBAL.socketCorr.off('messageManager');

                    GLOBAL.socketCorr.emit('joinToFriendsRooms', {
                        userId: response.toJSON().user._id,
                        user: response.toJSON().user,
                        friends: [self.model.get('_id')],
                        text: 'escaped'
                    });

                    //GLOBAL.initGlobalChat();

                    console.log('deleted from friends user ' + response.toJSON().response);
                    self.trigger('fromFriendDelete');
                    $butMini.hide();
                    $butWrite.show();
                    $butKick.show();
                },
                error: function () {
                    console.log('friend do not deleted from friends(((');
                }
            });
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this
        }
    });


    return NewFriendPageView
});