var express = require("express");
var router = express.Router();
var nodemailer = require('nodemailer');
var constants = require('./var/constants');

var my_server = "http://localhost:3000"
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

router.get('/', (req, res) => {
	console.log("Hello friend");
	// res.render('index', {layout: 'layout.hbs', template: 'home-template'});
	res.redirect(my_server);  
});

var user_money = 100;

var user = "";
var pass = "";
var users = [];
var recovery_email = "";

var server_tables = [
	{table_id: '001', table_name: "roulette", table_type: "european"},
	{table_id: '002', table_name: "roulette", table_type: "american"},
	{table_id: '003', table_name: "roulette", table_type: "european"},
	{table_id: '004', table_name: "roulette", table_type: "american"},
	{table_id: '001', table_name: "blackjack"},
	{table_id: '002', table_name: "blackjack"},
	{table_id: '003', table_name: "blackjack"},
	{table_id: '001', table_name: "slots"},
	{table_id: '002', table_name: "slots"},
	{table_id: '003', table_name: "slots"},
	{table_id: '004', table_name: "slots"},
	{table_id: '005', table_name: "slots"},
];
	
router.get('/salon', function(req, res, next){
	server_tables.push(user);
  //console.log('salon---> ', server_tables);
  res.send({server_tables: server_tables, server_user: user });
});

router.post('/registration', function(req, res, next) {
	user = req.body.user; 
	pass = req.body.pass;
	users.push({user: user, pass: pass});
	//console.warn('registration---> ', req.body, user, pass, users);
	res.redirect('/salon');
});

router.get('/table/:table', function(req, res, next){
	var my_table = req.params.table;
	var game = my_table.split('_')[0]
	// console.log('table---> ', my_table, user, game);
	var server_user = {user: user, money: user_money, user_table: my_table, game: game}
	res.send({ server_user: server_user, game: game});
});

router.post('/choose_table', function(req, res, next) {
	var my_table = req.body.table_name + '_' + req.body.table_id;
	if(req.body.table_type !== "" && typeof req.body.table_type !== "undefined" && req.body.table_type !== null){
		my_table = my_table + '_' + req.body.table_type;
	} 
	
	user = req.body.user;
	//console.log('choose_table---> ', my_table, user);
	res.redirect('/table/' + my_table);
});

router.post('/recovery', function(req, res, next) {
	recovery_email = req.body.email; 
	mailOptions.to = recovery_email
	//console.warn('recovery---> ', mailOptions.to);

	transport.sendMail(mailOptions, function(error, info){
		if (error) {
		  //console.log('error--> ', error);
		} else {
		  //console.log('info--> ', info.response);
		}
	  });

	res.redirect('/recovery');
});

module.exports = router;