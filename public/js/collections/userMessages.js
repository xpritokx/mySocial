define([
    'Backbone',
    'models/userMessage'
], function (
    Backbone,
    MessageForUserModel
) {
    //collection for output models of user correspondence
    var MessagesForUserColl = Backbone.Collection.extend({
        model: MessageForUserModel,
        url: '/correspondence'
    });

    return MessagesForUserColl;
});