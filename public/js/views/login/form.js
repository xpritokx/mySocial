LoginPageView = Backbone.View.extend({
    el: $('#login-block'),
    events: {
        'click #signBut': 'showForm'
    },
    render: function() {
        var userViewInstance = new NewLoginView();
        this.$el.append(userViewInstance.render().el);
    }
});