UserPagesView = Backbone.View.extend({
    el: $('#containerHeaderBlock'),
    initialize: function() {
        console.log("UserPagesView this.collection = ", this.collection);
        this.model.fetch({
            success: function(response){
                console.log("new users ", response);
                _.each(response.toJSON(),
                    function(item){
                        console.log('"User Page" Successfully GET blog with id ' + item._id);
                    });
            },
            error: function(){
                console.log('Failed to get blogs');
            }
        });
        console.log("mod = ", this.model.toJSON())
    },
    render: function() {
        console.log("i in UserPages ready to render!");
        console.log(this.model);
        this.model.each(function(myModel) {
            var userViewInstance = new NewUserPageView({model:myModel});
            this.$el.append(userViewInstance.render().el);
        }, this);
    }
});