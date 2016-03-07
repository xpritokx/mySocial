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
            console.log("UserPagesView this.collection = ", this.collection);
            //this.listenToOnce(this.collection, 'reset', this.render);
            this.collection.fetch({reset: true},{
                success: function(response){
                    console.log('user ' + response.toJSON().username + 'is GET' );
                },
                error: function(){
                    console.log('Failed to get blogs');
                }
            });
            this.render();
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

