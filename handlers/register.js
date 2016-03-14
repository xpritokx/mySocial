var sendEmail = require('../helpers/sendEmail');
var UserDb = require('../models/user').User;

//description environment variable
//var env = process.env.NODE_ENV;
require('../config/' + process.env.NODE_ENV);

var DB_HOST = process.env.DB_HOST;
var PORT = process.env.PORT;

module.exports = function () {
    this.saveUser = function (req, res, next) {
        var user = new UserDb(req.body);
        console.log('Receive a POST request for registration');

        user.save (function (err, doc) {
            if (err) {
                return next(err);
            }
            var to = user.get('email');
            var title = 'Verification Public House';
            var text = 'click to link for verification =) "'+ DB_HOST +':'+ PORT +'/userLog/' + user.get('_id') + '"';

            sendEmail(to ,title, text);

            delete doc.hashedPassword;

            res.status(200).send(doc);
        })
    };
};