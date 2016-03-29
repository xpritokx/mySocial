define([
    'Backbone'
], function (
    Backbone
) {
    //model for storage data for correspondence
    var MessageForUserModel = Backbone.Model.extend({
        urlRoot: function(){
            return '/correspondence'
        }
    });

    return MessageForUserModel;
});