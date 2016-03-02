//collection for output Posts
PostsCollection = Backbone.Collection.extend({
    url: "/posts",
    model: PostModel
});