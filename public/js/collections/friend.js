define([
    'Backbone',
    'Underscore',
    'models/user'
], function (
    Backbone,
    _,
    UserPageModel
) {
    //collection for output friendPages
    var FriendsPagesCollection = Backbone.Collection.extend({
        url: "/friends",
        model: UserPageModel
    });

    return FriendsPagesCollection
});

