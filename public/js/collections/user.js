define([
    'Backbone',
    'Underscore',
    'models/user'
], function (
    Backbone,
    _,
    UserPageModel
) {
    //collection for storage models userPages
    var UserPagesCollection = Backbone.Collection.extend({
        url: '/users/',
        model: UserPageModel
    });

    return UserPagesCollection
});


