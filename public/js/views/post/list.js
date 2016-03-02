NewPostView = Backbone.View.extend({
    tagName: 'li',
    template: template('postElem'),
    initialize: function(){
        this.on('delete', this.remove, this);
        this.render();
    },
    events: {
        'click .deletePostButtonForm': 'deletePost'
    },
    deletePost: function() {
        console.log('i deleted');
        this.model.destroy({
            success: function(response) {
                console.log("Successfully DELETED post with id " + response.toJSON()._id);
                if (validModelInstance.get('username') !== 'admin') {
                    validModelInstance.set('userIsAuthorised', false);
                    router.navigate('#showPosts',{trigger: true});
                }
                //userIsValid();
                $('#posts-list').html('');
                postViewInstance.render();
            },
            error: function(){
                console.log("Failed to delete post!")
            }
        })
    },
    render: function(){
        console.log("el = ", this.$el);
        console.log('one post is render!');
        this.$el.html(this.template(this.model.toJSON()));
        return this
    }
});