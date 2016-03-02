/**
 * Created by Pritok on 28.02.2016.
 */
//models for work with user friends
FriendModel = Backbone.Model.extend({
    initialize : function () {
        this.on('change', function () {
            console.log(' modelFriend is been changed ');
        });
    },
    url: "/friends"
});