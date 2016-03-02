PostsView = Backbone.View.extend({
    el: '#posts-list',
    initialize: function() {
        console.log(this.collection);
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