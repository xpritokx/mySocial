define([
    'Backbone',
    'Underscore',
    'models/user'
], function (
    Backbone,
    _,
    UserPageModel
) {
    //collection for output userPages
    var UserPagesCollection = Backbone.Collection.extend({
        url: "/users/",
        model: UserPageModel
    });

    return UserPagesCollection
});


