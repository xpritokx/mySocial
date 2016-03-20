define([
    'Backbone',
    'Underscore',
    'models/invite',

    'helpers/showUpdateButton',

    'text!templates/inviteToFriends.html'
], function (
    Backbone,
    _,
    InviteModel,

    showUpdateButton,

    tempInvites
) {
    var NewInvitePageView = Backbone.View.extend({
        //tagName: 'li',

        template: _.template(tempInvites),

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
            'click .butApply'  : 'addUserToFriends',
            'click .butCancel' : 'cancelUserToFriends'
        },

        cancelUserToFriends: function () {
            var self = this;
            var modelForAddFriend = new InviteModel();
            //var posCanceledUser;

            modelForAddFriend.urlRoot = '/inviteToFriends/cancel';

            //posCanceledUser = GLOBAL.listInvites.indexOf(self.model.get('_id'));

            //if (posCanceledUser >= 0) {
            //    GLOBAL.listInvites.splice(posCanceledUser, 1);
            //}

            modelForAddFriend.save({
                userId: this.model.get('_id')
            }, {
                success: function (response) {
                    console.log('invite user is cancelled ', response.toJSON().result);

                    self.remove()
                },
                error: function () {
                    console.log('Cancelled invite to friends is failed!');
                }
            });
        },

        //adding user to friends
        addUserToFriends: function () {
            var self = this;
            var modelForAddFriend = new InviteModel();

            modelForAddFriend.urlRoot = '/inviteToFriends/apply';

            modelForAddFriend.save({
                userId: this.model.get('_id')
            }, {
                success: function (response) {
                    console.log('Adding user is success');
                    console.log('firstUser = ', response.toJSON().firstUser);
                    console.log('secondUser = ', response.toJSON().secondUser);
                    console.log('secondUserId = ', response.toJSON().secondUserId);

                    GLOBAL.socketCorr.emit('joinToFriendsRooms', {
                        userId: response.toJSON().userModel._id,
                        user: response.toJSON().userModel,
                        friends: [response.toJSON().secondUserId],
                        text: 'entered'
                    });


                    GLOBAL.socketCorr.emit('joinToFriendsRooms', {
                        userId: response.toJSON().opponentModel._id,
                        user: response.toJSON().opponentModel,
                        friends: [response.toJSON().firstUserId],
                        text: 'entered'
                    });

                    self.remove()
                },
                error: function () {
                    console.log('Adding user is failed!');
                }
            });
        },


        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this
        }
    });


    return NewInvitePageView
});
