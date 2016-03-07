define([
    'Backbone',
    'Underscore',
    'text!templates/postElem.html'
], function (
    Backbone,
    _,
    temp
) {
    var NewPostView = Backbone.View.extend({
        tagName: 'li',
        template: _.template(temp),
        initialize: function(){
            this.on('destroy', this.remove, this);
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
                    $('#posts-list').html('');
                    initPosts();
                    //postsViewInstance().render();
                    //console.log('app router ', app);
                    //router.navigate('/', {trigger: true})
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

    return NewPostView
});

