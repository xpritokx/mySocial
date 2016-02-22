/**
 * Created by Pritok on 16.02.2016.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var sessions = require('express-session');
var cookie = require('cookie-parser');
var http = require('http');
var mongoose = require('mongoose');

var app = express();

app.use(bodyParser.json());
app.use(cookie());
app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(__dirname + '/public/images/favicon1.ico'));

//path = > path which have cookie
//httpOnly => security against XSS attack!
// maxAge => cookie deleting how closing brauser

var MongoStore = require('connect-mongo')(sessions);

app.use(sessions({
    "secret": "Transcarpathian",
    "cookie": {
        "path": "/",
        "httpOnly": true,
        "maxAge": null
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));    //connect.cid


http.createServer(app).listen(3060);

require('./createDb');
require('./routes')(app);
module.exports = app;