
var bcrypt = require('bcrypt-nodejs');
var apis = require('../models/api');
var users = require('../models/users');
var players = require('../models/players');
var email = require('emailjs');
var userData;

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

	app.post('/registrar/check', function(req, res) {
		users.check(req, res);
	});

	app.get('/perfil', isLoggedIn, function(req, res) {
		console.log(req.user);
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
		console.log(req.user);
		res.render('jogadores.ejs', {
			lang : res,
			user : req.user 
		});
	});

	app.get('/jogadores/buscar', isLoggedIn, function(req, res) {
		players.read(req, res);
	});

	app.get('/configuracoes/', isLoggedIn, function(req, res) {
		res.render('configuracoes.ejs', {
			user : req.user
		});
	});

	app.get('/configuracoes/dependentes', isLoggedIn, function(req, res) {
		users.listDependents(req, res);
	});

	app.post('/configuracoes/dependentes', isLoggedIn, function(req, res) {
		users.createDependents(req, res);
	});

	app.put('/configuracoes/dependentes', isLoggedIn, function(req, res) {
		users.updateDependents(req, res);
	});

	app.post('/configuracoes/dependentes/check', isLoggedIn, function(req, res) {
		users.check(req, res);
	});

	//API SECTION //
	app.get('/api/genders/', isLoggedIn, function(req, res) {
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

	app.get('/api/player/positions', isLoggedIn, function(req, res) {
		apis.listPositionsByPlayer(req, res);
	});

	app.get('/api/positions/', isLoggedIn, function(req, res) {
		apis.listPositions(req, res);
	});

	app.get('/api/configuracoes/dependentes', isLoggedIn, function(req, res) {
		users.listDependents(req, res);
	});

	app.get('/api/positions/:id', isLoggedIn, function(req, res) {
		apis.listPositionsByGround(req, res);
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


