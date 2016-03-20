define([
    'Backbone',
    'Underscore',
    'jQuery',

    'helpers/showUpdateButton',

    'views/friends/list'
], function (
    Backbone,
    _,
    $,

    showUpdateButton,

    NewFriendPageView
){
    var FriendsPagesView = Backbone.View.extend({
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
            var $butKick;
            var $butWrite;
            var $butMini;

            //this.collection.off('reset');
            this.collection.each(function (myModel) {
                var friendViewInstance = new NewFriendPageView({model: myModel});
                this.$el.append(friendViewInstance.render().el);

            }, this);

            $butKick = $('.butKick');
            $butWrite = $('.butWrite');
            $butMini = $('.butMini');

            $butMini.hide();
            $butKick.show();
            $butWrite.show();

            return this
        }
    });

    return FriendsPagesView
});

