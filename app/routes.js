
var bcrypt = require('bcrypt-nodejs');
var apis = require('../models/api');
var users = require('../models/users');

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





	app.get('/jogadores', function(req, res) {
		res.render('jogadores.ejs', {
			user : req.user 
		});
	});

	app.get('/jogadores/:id', function(req, res) {
		res.render('jogador.ejs', {
			user : req.user
		});
	});

	app.get('/jogadores/buscar/:id', function(req, res) {
		res.render('jogadores.ejs', {
			user : req.user
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


