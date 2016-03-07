/**
 * Created by Pritok on 16.02.2016.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var sessions = require('express-session');
var cookie = require('cookie-parser');
var mongoose = require('mongoose');
var http = require('http');

//database host name 'localhost':
var DB_HOST;

//database name 'social'
var DB_NAME;

//database port ::27017
var DB_PORT;


var db;

//option for connection to db
var connectionOptions;

//description environment variable
var env = process.env.NODE_ENV;
console.log('project in ', env);
require('./config/' + env);

var app = express();

DB_HOST = process.env.DB_HOST;
DB_NAME = process.env.DB_NAME;
DB_PORT = parseInt(process.env.DB_PORT, 10);

connectionOptions = {
    server: {poolSize: 5},
    //user: process.env.DB_USER,
    //pass: process.env.DB_NAME,
    w: 1,
    j: true
};

//connection to db
//mongoose.connect('localhost', 'social', '27017', [opt]);
mongoose.connect(DB_HOST, DB_NAME, DB_PORT, connectionOptions);

db = mongoose.connection;

db.once('connected', onConnection);
db.on('error', function(err){
    throw err;
});



function onConnection() {
    //port = 8088
    var port = process.env.PORT;

    //auth stack middleware
    var authStackMiddleware = require('./helpers/auth');

    port = parseInt(port, 10);

    //declaration routers
    var userRouter = require('./routes/users');
    var postRouter = require('./routes/posts');
    var friendRouter = require('./routes/friends');
    var authRouter = require('./routes/auth');
    var indexRouter = require('./routes/index');
    var restoreRouter = require('./routes/restore');
    var registerRouter = require('./routes/register');


    console.log("database in connection");

    //require db schemas user/post
    require('./models/index');

    app.use(bodyParser.json());
    app.use(cookie());
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(favicon(__dirname + '/public/images/favicon2.ico'));

    //required store for save sessions
    var MongoStore = require('connect-mongo')(sessions);

    //creating sessions
    //path = > path which have cookie
    //httpOnly => security against XSS attack!
    // maxAge => cookie deleting how closing brauser
    app.use(sessions({
        "secret": "Transcarpathian",
        "cookie": {
            "path": "/",
            "httpOnly": true,
            "maxAge": null
        },
        store: new MongoStore({
            mongooseConnection: db
        })
    }));

    //ROUTES

    app.use('/users', registerRouter);
    app.use('/users', authStackMiddleware, userRouter);
    app.use('/posts', authStackMiddleware, postRouter);
    app.use('/friends', authStackMiddleware, friendRouter);

    app.use('/userLog', authRouter);
    app.use('/sendRestore', restoreRouter);
    app.use('/', authStackMiddleware,indexRouter);




    app.use(function (err, req, res, next) {
        var status = err.status || 500;

        if (process.env.NODE_ENV === 'production') {
            res.status(status).send({error: err.message});
            console.error(err.message + '\n' + err.stack);
        } else {
            res.status(status).send({error: err.message + '\n' + err.stack});
            console.error(err.message + '\n' + err.stack);
        }
    });


    //running server
    var server = http.createServer(app).listen(port, function () {
        console.log('server is listing post ', port);
    });

    require('./helpers/chat')(server)

}



