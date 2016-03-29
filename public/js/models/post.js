define([
    'Backbone'
], function (
    Backbone
) {
    //model for storage data one post
    var PostModel = Backbone.Model.extend({
        initialize : function () {
            this.on('change', function () {
                console.log(' postModel is been changed ');
            });
        }

    });

    return PostModel
});


