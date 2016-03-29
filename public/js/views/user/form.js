define([
    'Backbone',
    'Underscore',
    'jQuery',

    'helpers/hideFriends',
    'helpers/showUpdateButton',

    'views/user/list'
], function (
    Backbone,
    _,
    $,

    hideFriends,
    showUpdateButton,

    NewUserPageView
){
    var UserPagesView = Backbone.View.extend({
        el: $('#containerHeaderBlock'),

        initialize: function() {
            //this.render();
            this.collection.once('reset', this.render, this);
            this.getDataToCollection();
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
            //this.collection.off('reset');
            this.collection.each(function (myModel) {
                var userViewInstance = new NewUserPageView({model: myModel});
                this.$el.append(userViewInstance.render().el);
            }, this);

            if (this.model) {
                console.log('TM!' ,this.model);
                hideFriends(this.model);
            }

            showUpdateButton();

            return this
        }
    });

    return UserPagesView
});

