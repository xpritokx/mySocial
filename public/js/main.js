/**
 * Created by Pritok on 05.03.2016.
 */
require.config({
    paths: {
        jQuery: 'libs/jquery/dist/jquery',
        Underscore: 'libs/underscore/underscore',
        Backbone: 'libs/backbone/backbone',
        text: 'libs/text/text',
        collections: 'collections',
        views: 'views',
        models: 'models',
        templates: '../templates'
    },
    shim: {
        Underscore: {
            exports: '_'
        },
        jQuery: {
            exports: '$'
        },
        Backbone: ['Underscore', 'jQuery'],
        app: ['Backbone']
    }
});
require(['app'], function (app) {
    app.init();

    //socket = io.connect();

    Backbone.history.start();
});