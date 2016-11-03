
var bcrypt = require('bcrypt-nodejs');
var apis = require('../models/api');
var users = require('../models/users');
var players = require('../models/players');
var email = require('emailjs');
var https = require('https');


module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('index.ejs', {lang: res}); 
	});

	app.get('/entrar', function(req, res) {
		res.render('entrar.ejs', { lang: res, message: req.flash('loginMessage') });
	});

	app.post('/entrar', passport.authenticate('local-login', {
            successRedirect : '/perfil', 
            failureRedirect : '/entrar', 
            failureFlash : true 
		}),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	app.get('/registrar', function(req, res) {
		res.render('registrar.ejs', { lang: res, message: req.flash('signupMessage') });
	});

	app.post('/registrar', passport.authenticate('local-signup', {
		successRedirect : '/perfil', 
		failureRedirect : '/registrar',
		failureFlash : true 
	}));

	app.get('/perfil', isLoggedIn, function(req, res) {
		res.render('perfil.ejs', {
			lang : res, 
			user : req.user
		});
	});

	app.post('/perfil', isLoggedIn, function(req, res) {
		users.update(req, res);
	});

	app.get('/jogadores/editar', isLoggedIn, function(req, res) {
		res.render('jogador.ejs', {
			user : req.user
		});
	});

	app.post('/jogadores/editar', isLoggedIn, function(req, res) {
		players.create(req, res);
	});

	app.get('/jogadores/', isLoggedIn, function(req, res) {
		res.render('jogadores.ejs', {
			lang : res,
			user : req.user 
		});
	});

	app.get('/jogadores/search', isLoggedIn, function(req, res) {
		players.read(req, res);
	});





	






	

	

	







	//API SECTION //
	app.get('/api/genders/', function(req, res) {
		apis.listGenders(req, res);
	});

	app.get('/api/nationalities/', isLoggedIn, function(req, res) {
		apis.listNationalities(req, res);
	});

	app.get('/api/countries/', isLoggedIn, function(req, res) {
		apis.listCountries(req, res);
	});

	app.get('/api/states/:id', isLoggedIn, function(req, res) {
		apis.listStates(req, res);
	});

	app.get('/api/cities/:id', isLoggedIn, function(req, res) {
		apis.listCities(req, res);
	});

	app.get('/api/grounds/', isLoggedIn, function(req, res) {
		apis.listGrounds(req, res);
	});

	app.get('/api/positions/:id', isLoggedIn, function(req, res) {
		apis.listPositions(req, res);
	});








	app.get('/teste/', function(req, res) {
		apis.listCities(req, res);
		
		https.globalAgent.options.secureProtocol = 'SSLv3_method';
		var email = require('emailjs');
		var server = email.server.connect({
			user: "melzer.caio@gmail.com", 
			password:"Ca!!1603", 
			host: "smtp.gmail.com", 
			ssl: true,
			port: 587
		});

		server.send({
		  text: 'Hey howdy',
		  from: 'NodeJS',
		  to: 'melzer.caio@gmail.com',
		  cc: '',
		  subject: 'Greetings'
		}, function (err, message) {
		  console.log(err || message);
		});
	});



	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}


