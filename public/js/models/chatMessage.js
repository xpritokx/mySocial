/**
 * Created by Pritok on 07.03.2016.
 */
define([
    'Backbone'
], function (
    Backbone
) {
    var MessageModel = Backbone.Model.extend({
        urlRoot: function(){
            return '/chat'
        }
    });

    return MessageModel;
});

