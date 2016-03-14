/**
 * Created by Pritok on 11.03.2016.
 */
define([
    'Backbone'
], function (
    Backbone
) {
    //model exchange data for correspondence
    var MessageForUserModel = Backbone.Model.extend({
        urlRoot: function(){
            return '/correspondence'
        }
    });

    return MessageForUserModel;
});