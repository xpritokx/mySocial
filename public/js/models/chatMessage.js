define([
    'Backbone'
], function (
    Backbone
) {
    //model storage data for chat
    var MessageModel = Backbone.Model.extend({
        urlRoot: function(){
            return '/chat'
        }
    });

    return MessageModel;
});

