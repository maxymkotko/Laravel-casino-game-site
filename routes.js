var express = require("express");
var path = require("path");
var router = express.Router();
var nodemailer = require('nodemailer');
var constants = require('./var/constants');

var my_server = constants.SERVER;
var transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
	  user: constants.AUTH_USER,
	  pass: constants.AUTH_PASS
	}
}); 

var mailOptions = {
	from: constants.AUTH_FROM,
	to: '',
	subject: 'Casino recovery',
	html: '<h1>Recovery username and password</h1><p>Username: xxx</p><p>Password: xxx</p><p>Go to <a target="_blank" href="'+my_server+'/recovery">Link</a> to recover them.</p>'
};

router.use(express.static(path.join(__dirname, '/client/build')));
router.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

var recovery_email = "";

router.post('/registration', function(req, res, next) {
	res.redirect('/salon');
});

router.post('/recovery', function(req, res, next) {
	recovery_email = req.body.email; 
	mailOptions.to = recovery_email

	transport.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log('error--> ', error);
		} else {
		  console.log('info--> ', info.response);
		}
	  });

	res.redirect('/recovery');
});

module.exports = router;