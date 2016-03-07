define([
    'Backbone',
    'Underscore',
    'models/post'
], function (
    Backbone,
    _,
    PostModel
) {
    //collection for output Posts
    var PostsCollection = Backbone.Collection.extend({
        url: "/posts",
        model: PostModel
    });

    return PostsCollection
});
