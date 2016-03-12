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
            var self = this;
            console.log("UserPagesView this.collection = ", this.collection);
            //this.listenToOnce(this.collection, 'change', this.render);
            this.getDataToCollection();
            //this.collection.once('reset', self.render, self);
            self.render();
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
            console.log("i in UserPages ready to render!");
            this.collection.each(function(myModel) {
                var userViewInstance = new NewUserPageView({model: myModel});
                this.$el.append(userViewInstance.render().el);
            }, this);
        }
    });

    return UserPagesView
});

