/**
 * Created by Pritok on 07.03.2016.
 */
define([
    'Backbone',
    'models/chatMessage'
], function (
    Backbone,
    MessageModel
) {
    var MessagesColl = Backbone.Collection.extend({
        model: MessageModel,
        url: '/chat'
    });

    return MessagesColl;
});