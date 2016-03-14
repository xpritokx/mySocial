define([
    'Backbone'
], function (
    Backbone
) {
    //models for work with user friends
    var FriendModel = Backbone.Model.extend({
        initialize : function () {
            this.on('change', function () {
                console.log(' modelFriend has been changed ');
            });
        },
        urlRoot: "/friends"
    });

    return FriendModel
});

