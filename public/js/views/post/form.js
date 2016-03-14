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
            //this.collection.on('reset', this.render, this);

            this.collection.fetch();
            this.render();
        },
        render: function() {
            this.collection.each(function(myModel) {
                var postView = new NewPostView({model:myModel});
                this.$el.append(postView.render().el);
            }, this);
        }
    });

    return PostsView
});

