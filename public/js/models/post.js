define([
    'Backbone'
], function (
    Backbone
) {
    //create new post
    var PostModel = Backbone.Model.extend({
        initialize : function () {
            this.on('change', function () {
                console.log(' postModel is been changed ');
            });
        },
        defaults: {
            title: "new Post",
            content: "empty",
            image: 'images/question.png'
        }
    });

    return PostModel
});


