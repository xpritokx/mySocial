define([
    'Backbone',
    'Underscore',
    'models/post'
], function (
    Backbone,
    _,
    PostModel
) {
    //collection for storage models Posts
    var PostsCollection = Backbone.Collection.extend({
        url: '/posts',
        model: PostModel
    });

    return PostsCollection
});
