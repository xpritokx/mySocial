define([
    'Backbone',
    'Underscore',
    'jQuery',

    'helpers/showUpdateButton',

    'views/invite/list'
], function (
    Backbone,
    _,
    $,

    showUpdateButton,

    NewInviteView
){
    var InvitePagesView = Backbone.View.extend({
        el: $('#containerHeaderBlock'),

        initialize: function() {
            console.log('i am initializing invites');
            this.collection.on('reset', this.render, this);
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
            console.log('im rendering invites!!');
            console.log(this.collection);

            this.collection.off('reset');

            this.collection.each(function (myModel) {
                var userViewInstance = new NewInviteView({model: myModel});
                this.$el.append(userViewInstance.render().el);
            }, this);

            return this
        }
    });

    return InvitePagesView
});