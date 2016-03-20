define([
    'Backbone',
    'Underscore',

    'helpers/showUpdateButton',

    'text!templates/postElem.html'
], function (
    Backbone,
    _,

    showUpdateButton,

    temp
) {
    var NewPostView = Backbone.View.extend({
        tagName: 'li',

        template: _.template(temp),

        initialize: function(){
            this.model.on('destroy', this.remove, this);
        },

        events: {
            'click .deletePostButtonForm': 'deletePost'
        },

        deletePost: function() {
            console.log('i deleted');
            this.model.destroy({
                success: function(response) {
                    console.log('Successfully DELETED post with id ' + response.toJSON()._id);
                },
                error: function(){
                    console.log('Failed to delete post!')
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

