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
            //this.render();
        },
        events: {
            'click .deletePostButtonForm': 'deletePost'
        },
        deletePost: function() {
            var $postList = $('#posts-list');
            console.log('i deleted');
            this.model.destroy({
                success: function(response) {
                    console.log("Successfully DELETED post with id " + response.toJSON()._id);
                    $postList.html('');
                    GLOBAL.initPosts();
                    $('.deletePostButtonForm').hide();
                },
                error: function(){
                    console.log("Failed to delete post!")
                }
            })
        },
        render: function(){
            console.log('one post is render!');
            this.$el.html(this.template(this.model.toJSON()));
            return this
        }
    });

    return NewPostView
});

