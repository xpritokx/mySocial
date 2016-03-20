define([
    'Backbone',
    'models/chatMessage'
], function (
    Backbone,
    MessageModel
) {
    //collection for storage models Messages of chat
    var MessagesColl = Backbone.Collection.extend({
        model: MessageModel,
        url: '/chat'
    });

    return MessagesColl;
});