define([
    'Backbone',
    'Underscore',
    'jQuery',

    'views/chat/chat',
    'views/correspondence/correspondence',

    'helpers/sockets',

    'router'
], function (
    Backbone,
    _,
    $,

    ChatView,
    CorrespondenceView,
    sockets,

    Router
) {

    var correspondenceViewInstance;
    var chatViewInstance;

    Date.prototype.getMonthName = function() {
        var month = ['Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'];
        return month[this.getMonth()];
    };

    Date.prototype.adecvatFormat = function() {
        var monthMas = ['Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'];

        var day = this.getDate().toString();
        var month = this.getMonth();
        var year = this.getFullYear().toString();

        var hours = this.getHours();
        var minutes = this.getMinutes();
        var seconds = this.getSeconds();

        return monthMas[month] + '-' + day + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds;
    };

    GLOBAL = {};

    GLOBAL.socketCorr = io('/my_namespace');
    GLOBAL.socketCorrLocal = io('/my_local_chat');

    GLOBAL.counterMessages = {};
    GLOBAL.listInvites = [];

    GLOBAL.initChat = function (currentUserModel) {
        if (!chatViewInstance) {
            chatViewInstance = new ChatView({model: currentUserModel});
        } else {
            chatViewInstance.model = currentUserModel;
            chatViewInstance.render();
        }
    };

    GLOBAL.initCorrespondence = function (model) {

        if (!correspondenceViewInstance) {
            correspondenceViewInstance = new CorrespondenceView({model: model});
        } else {
            correspondenceViewInstance.model = model;
            correspondenceViewInstance.initialize();
        }
    };

    Backbone.Model.prototype.idAttribute = '_id';

    sockets();

    GLOBAL.router = new Router();

    return {
        init: function () {return 0}
    }
});
