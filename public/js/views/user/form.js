define([
    'Backbone',
    'Underscore',
    'jQuery',

    'views/user/list'
], function (
    Backbone,
    _,
    $,

    NewUserPageView
){
    var UserPagesView = Backbone.View.extend({
        el: $('#containerHeaderBlock'),
        initialize: function() {
            //var self = this;
            this.getDataToCollection();
            this.render();
        },
        getDataToCollection: function () {
            this.collection.fetch(
                {
                    reset: true,
                    success: function(col, res){
                        console.log('user is GET' );
                    },
                    error: function(col, res){

                        console.log('Failed to get blogs');
                    }
                }
            );
        },

        render: function() {
            this.collection.each(function(myModel) {
                var userViewInstance = new NewUserPageView({model: myModel});
                this.$el.append(userViewInstance.render().el);
            }, this);
        }
    });

    return UserPagesView
});

