//collection for output userPages
UserPagesCollection = Backbone.Collection.extend({
    url: "/users/",
    model: UserPageModel
});