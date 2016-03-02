//collection for output friendPages
FriendsPagesCollection = Backbone.Collection.extend({
    url: "/friends",
    model: UserPageModel
});