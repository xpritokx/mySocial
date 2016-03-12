/**
 * Created by Pritok on 11.03.2016.
 */
define([
    'Backbone',
    'models/userMessage'
], function (
    Backbone,
    MessageForUserModel
) {
    var MessagesForUserColl = Backbone.Collection.extend({
        model: MessageForUserModel,
        url: '/correspondence'
    });

    return MessagesForUserColl;
});