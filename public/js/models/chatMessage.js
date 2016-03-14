/**
 * Created by Pritok on 07.03.2016.
 */
define([
    'Backbone'
], function (
    Backbone
) {
    //model exchange data for chat
    var MessageModel = Backbone.Model.extend({
        urlRoot: function(){
            return '/chat'
        }
    });

    return MessageModel;
});

