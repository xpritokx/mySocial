define([
    'Backbone',
    'Underscore',
    'jQuery',

    'views/post/list'
], function (
    Backbone,
    _,
    $,
    NewPostView
){
    var PostsView = Backbone.View.extend({
        el: '#posts-list',
        initialize: function() {
            console.log('post collection', this.collection);
            //this.listenToOnce(this.collection, 'reset', this.render);
            console.log('render post col');
            this.collection.fetch();
            this.render();
        },
        render: function() {
            console.log('post - rendering in processing!');
            this.collection.each(function(myModel) {
                var postView = new NewPostView({model:myModel});
                this.$el.append(postView.render().el);
            }, this);
        }
    });

    return PostsView
});

