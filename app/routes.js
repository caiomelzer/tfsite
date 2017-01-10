
var bcrypt = require('bcrypt-nodejs');
var apis = require('../models/api');
var users = require('../models/users');
var players = require('../models/players');
var teams = require('../models/teams');
var entities = require('../models/entities');
var games = require('../models/games');
var places = require('../models/places');
var email = require('emailjs');
var nodemailer = require('nodemailer');
var userData;

module.exports = function(app, passport) {
	app.get('/*', function(req, res, next){ 
		res.setHeader('Last-Modified', (new Date()).toUTCString());
		next(); 
	});

	app.get('/', function(req, res) {
		res.render('index.ejs', {lang: res}); 
	});



	app.get('/entrar', function(req, res) {
		res.render('entrar.ejs', { lang: res, message: req.flash('loginMessage') });
	});

	app.get('/teste', function(req, res){
		var transporter = nodemailer.createTransport('smtps://nao-responda%40terradofutebol.com.br:mewtwo@md-20.webhostbox.net');
		var mailOptions = {
		    from: '"Fred Foo 👥" <nao-responda@terradofutebol.com.br>', // sender address 
		    to: 'melzer.caio@gmail.com', // list of receivers 
		    subject: 'Hello ✔', // Subject line 
		    text: 'Hello world 🐴', // plaintext body 
		    html: '<b>Hello world 🐴</b>' // html body 
		};
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		});
	});

	app.post('/entrar', passport.authenticate('local-login', {
            successRedirect : '/dashboard', 
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

	app.get('/dashboard', isLoggedIn, function(req, res) {
		res.render('dashboard.ejs', {
			lang : res, 
			user : req.user
		});
	});

	app.get('/perfil', isLoggedIn, function(req, res) {
		res.render('perfil.ejs', {
			lang : res, 
			user : req.user
		});
	});

	app.post('/perfil', isLoggedIn, function(req, res) {
		users.update(req, res);
	});



	app.get('/times/meus-times', isLoggedIn, function(req, res) {
		res.render('meus-times.ejs', {
			lang : res,
			user : req.user
		});
	});

	app.get('/times/', isLoggedIn, function(req, res) {
		res.render('times.ejs', {
			lang : res,
			user : req.user
		});
	});

	app.get('/times/buscar/meus-times', isLoggedIn, function(req, res) {
		teams.myTeams(req, res);
	});

	app.delete('/times/:id', isLoggedIn, function(req, res) {
		teams.disable(req, res);
	});
	
	app.get('/times/buscar', isLoggedIn, function(req, res) {
		teams.search(req, res);
	});

	app.get('/times/editar/:id', isLoggedIn, function(req, res) {
		teams.editMyTeam(req, res);
	});

	app.post('/times/editar/:id', isLoggedIn, function(req, res) {
		teams.update(req, res);
	});

	app.get('/times/:slug/', isLoggedIn, function(req, res) {
		teams.read(req, res);
	});

	app.post('/times/follow/:id', isLoggedIn, function(req, res) {
		teams.follow(req, res);
	});

	app.get('/times/following/:id', isLoggedIn, function(req, res) {
		teams.following(req, res);
	});

	app.get('/times/followers/:id', isLoggedIn, function(req, res) {
		teams.followers(req, res);
	});

	app.post('/times/unfollow/:id', isLoggedIn, function(req, res) {
		teams.unfollow(req, res);
	});

	app.get('/jogos/convites/meus-times', isLoggedIn, function(req, res) {
		games.myTeams(req, res);
	});

	app.get('/jogos/convites/quadras', isLoggedIn, function(req, res) {
		games.places(req, res);
	});

	app.post('/jogos/convites/', isLoggedIn, function(req, res) {
		games.invite(req, res);
	});

	app.get('/quadras/', isLoggedIn, function(req, res) {
		res.render('quadras.ejs', {
			lang : res,
			user : req.user
		});
	});




	app.get('/jogadores/editar', isLoggedIn, function(req, res) {
		res.render('jogador.ejs', {
			lang : res,
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

	app.get('/jogadores/buscar', isLoggedIn, function(req, res) {
		players.search(req, res);
	});

	app.get('/jogadores/:id', isLoggedIn, function(req, res) {
		players.read(req, res);
	});

	app.get('/configuracoes/', isLoggedIn, function(req, res) {
		res.render('configuracoes.ejs', {
			lang : res,
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

	app.get('/configuracoes/entidades', isLoggedIn, function(req, res) {
		entities.read(req, res);
	});

	app.post('/configuracoes/entidades', isLoggedIn, function(req, res) {
		entities.create(req, res);
	});

	app.get('/configuracoes/times', isLoggedIn, function(req, res) {
		teams.read(req, res);
	});

	app.get('/configuracoes/times/:id', isLoggedIn, function(req, res) {
		teams.read(req, res);
	});

	app.post('/configuracoes/times', isLoggedIn, function(req, res) {
		teams.create(req, res);
	});

	app.post('/configuracoes/quadras', isLoggedIn, function(req, res) {
		places.create(req, res);
	});

	app.get('/configuracoes/quadras', isLoggedIn, function(req, res) {
		places.myPlaces(req, res);
	});

	//Static Files


	//Admin Side
	app.get('/configuracoes/admin/', isLoggedIn, function(req, res) {
		res.render('admin.ejs', {
			user : req.user
		});
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


