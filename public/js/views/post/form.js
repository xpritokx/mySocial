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
            this.collection.once('reset', this.render, this);

            this.getDataToCollection();

        },

        //fetching model without render
        getDataToCollection: function () {
            this.collection.fetch({reset: true});
        },

        render: function() {
            this.collection.each(function(myModel) {
                var postView;

                postView = new NewPostView({model:myModel});
                this.$el.append(postView.render().el);
            }, this);
        }
    });

    return PostsView
});

