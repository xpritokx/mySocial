define([
    'Backbone',
    'models/userMessage'
], function (
    Backbone,
    MessageForUserModel
) {
    //collection for storage models of user correspondence
    var MessagesForUserColl = Backbone.Collection.extend({
        model: MessageForUserModel,
        url: '/correspondence'
    });

    return MessagesForUserColl;
});