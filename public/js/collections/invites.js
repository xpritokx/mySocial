define([
    'Backbone',
    'models/invite'
], function (
    Backbone,
    InviteToFriendsModel
) {
    //collection for storage models Messages of chat
    var InviteToFriendsColl = Backbone.Collection.extend({
        model: InviteToFriendsModel,
        url: '/inviteToFriends'
    });

    return InviteToFriendsColl;
});