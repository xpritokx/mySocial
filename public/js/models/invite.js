define([
    'Backbone'
], function (
    Backbone
) {
    //model for storage data of change state verification User after link in the email (True/False)
    var InviteToFriendsModel = Backbone.Model.extend({
        urlRoot: function() {
            return '/inviteToFriends'
        }
    });

    return InviteToFriendsModel
});