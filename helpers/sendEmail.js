var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// function which send message to email
module.exports = function sendEmail(to, title, text) {

    //description authorization in to email client
    var transport = nodemailer.createTransport(
        smtpTransport({
            service: 'gmail',
            auth: {
                user: 'xpritokx@gmail.com',
                pass: 'xapdcop5356250'
            }
        })
    );

    //params which routing when and what sending
    var params = {
        from: 'xpritokx@gmail.com',
        to: to,//req.body.email,
        subject: title,//sender + ' welcomes you!',
        text: text//'Hello i want to invite you in the Public House! Just click in this link www.publichouse.com.ua'
    };
    //function which sending message whith our param in to email
    transport.sendMail(params, function (err, res) {
        if (err) {
            console.error("mail err = ", err);
        }
    });

};

