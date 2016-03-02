/**
 * Created by Pritok on 28.02.2016.
 */
//create new post
PostModel = Backbone.Model.extend({
    initialize : function () {
        this.on('change', function () {
            console.log(' postModel is been changed ');
        });
    },
    defaults: {
        title: "new Post",
        content: "empty",
        image: ""
    }
});