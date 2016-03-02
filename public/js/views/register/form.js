RegisterPageView = Backbone.View.extend({
    el: '#global',
    events: {
        'click #regBut': 'showForm'
    },
    render: function() {
        var registerView = new NewRegisterView({collection: this.model});
        $('#register-block').append(registerView.render().el);
    }
});