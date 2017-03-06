
var bcrypt = require('bcrypt-nodejs');
var apis = require('../models/api');
var users = require('../models/users');
var players = require('../models/players');
var teams = require('../models/teams');
var entities = require('../models/entities');
var games = require('../models/games');
var adm = require('../models/adm');
var places = require('../models/places');
var mkt = require('../models/mkt');
var email = require('emailjs');
var nodemailer = require('nodemailer');
var userData;

module.exports = function(app, passport) {
	app.get('/*', function(req, res, next){ 
		res.setHeader('Last-Modified', (new Date()).toUTCString());
		next(); 
	});

	app.get('/', function(req, res) {
		res.render('index.ejs', 
			{
				lang: res
			}
		); 
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
            successRedirect : '/times', 
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

	app.get('/ativar/:username/:hash', function(req, res) {
		users.activate(req, res);
	});

	app.post('/registrar', passport.authenticate('local-signup', {
		successRedirect : '/perfil', 
		failureRedirect : '/registrar',
		failureFlash : true 
	}));

	app.post('/registrar/check', function(req, res) {
		users.check(req, res);
	});

	app.get('/painel', isLoggedIn, function(req, res) {
		res.render('painel.ejs', {
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

	app.get('/agremiacoes', function(req, res) {
		res.render('agremiacoes.ejs', {
			lang : res,
			user : req.user
		});
	});

	app.get('/agremiacoes/buscar', function(req, res) {
		entities.search(req, res);
	});

	app.get('/agremiacoes/minhas-agremiacoes', isLoggedIn, function(req, res) {
		res.render('minhas-agremiacoes.ejs', {
			lang : res,
			user : req.user
		});
	});

	app.get('/agremiacoes/:id/', function(req, res) {
		entities.read(req, res);
	});

	app.get('/agremiacoes/buscar/minhas-agremiacoes', isLoggedIn, function(req, res) {
		entities.myEntities(req, res);
	});

	app.get('/agremiacoes/editar/:id', isLoggedIn, function(req, res) {
		entities.editMyEntity(req, res);
	});

	app.post('/agremiacoes/editar/:id', isLoggedIn, function(req, res) {
		entities.update(req, res);
	});

	app.get('/times/meus-times', isLoggedIn, function(req, res) {
		res.render('meus-times.ejs', {
			lang : res,
			user : req.user
		});
	});

	app.get('/times/', function(req, res) {
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
	
	app.get('/times/buscar', function(req, res) {
		teams.search(req, res);
	});

	app.get('/times/editar/:id', isLoggedIn, function(req, res) {
		teams.editMyTeam(req, res);
	});

	app.post('/times/editar/:id', isLoggedIn, function(req, res) {
		teams.update(req, res);
	});

	app.post('/times/editar/:id/quadras/:place_id', isLoggedIn, function(req, res) {
		teams.updatePlace(req, res);
	});

	app.post('/times/editar/:id/remover-local', isLoggedIn, function(req, res) {
		teams.myTeamRemovePlace(req, res);
	});

	app.get('/times/:slug', function(req, res) {
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

	app.get('/times/jogadores/lista/disponiveis/:id', isLoggedIn, function(req, res) {
		teams.listPlayersAvaliable(req, res);
	});

	app.get('/times/jogadores/lista/:id', function(req, res) {
		teams.listPlayers(req, res);
	});

	app.post('/times/jogadores/:team_id/adicionar/:id', isLoggedIn, function(req, res) {
		teams.addPlayer(req, res);
	});

	app.post('/times/jogadores/:team_id/remover/:id', isLoggedIn, function(req, res) {
		teams.removePlayer(req, res);
	});

	app.get('/jogos/convites/meus-times/:id', isLoggedIn, function(req, res) {
		games.possibleOpponents(req, res);
	});

	app.get('/jogos/', function(req, res) {
		games.listAll(req, res);
	});

	app.get('/jogos/anteriores', function(req, res) {
		games.listOlds(req, res);
	});	

	app.get('/jogos/proximos', function(req, res) {
		games.listNext(req, res);
	});	

	app.get('/jogos/time/:id', function(req, res) {
		games.listByTeam(req, res);
	});	

	app.get('/jogos/convites/quadras/:id', isLoggedIn, function(req, res) {
		games.listPlaces(req, res);
	});

	app.post('/jogos/convites/', isLoggedIn, function(req, res) {
		games.invite(req, res);
	});

	app.get('/jogos/convites/', isLoggedIn, function(req, res) {
		games.list(req, res);
	});

	app.post('/jogos/convites/resposta', isLoggedIn, function(req, res) {
		games.answerInvite(req, res);
	});

	app.get('/jogos/convites/:id', isLoggedIn, function(req, res) {
		games.invitePlayers(req, res);
	});

	app.get('/jogos/convites/:id/lista/:team_id', isLoggedIn, function(req, res) {
		games.inviteListPlayers(req, res);
	});

	app.post('/jogos/convites/:game_id/:team_id/:player_id', isLoggedIn, function(req, res) {
		games.inviteListPlayersToGame(req, res);
	});

	app.post('/jogos/convites/:game_id/:team_id/:player_id/remover', isLoggedIn, function(req, res) {
		games.cancelInviteListPlayersToGame(req, res);
	});

	app.get('/quadras/', isLoggedIn, function(req, res) {
		res.render('quadras.ejs', {
			lang : res,
			user : req.user
		});
	});

	app.get('/quadras/listar', isLoggedIn, function(req, res) {
		places.list(req, res);
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

	app.get('/jogadores/', function(req, res) {
		res.render('jogadores.ejs', {
			lang : res,
			user : req.user 
		});
	});

	app.get('/jogadores/buscar', function(req, res) {
		players.search(req, res);
	});

	app.get('/jogadores/:id', function(req, res) {
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
		entities.list(req, res);
	});

	app.post('/configuracoes/entidades', isLoggedIn, function(req, res) {
		entities.create(req, res);
	});

	app.post('/configuracoes/entidades/deletar/:id', isLoggedIn, function(req, res) {
		entities.delete(req, res);
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

	app.post('/configuracoes/times/deletar/:id', isLoggedIn, function(req, res) {
		teams.delete(req, res);
	});

	app.post('/configuracoes/quadras', isLoggedIn, function(req, res) {
		places.create(req, res);
	});

	app.post('/configuracoes/quadras/deletar/:id', isLoggedIn, function(req, res) {
		places.delete(req, res);
	});

	app.get('/configuracoes/quadras', isLoggedIn, function(req, res) {
		places.myPlaces(req, res);
	});

	app.get('/erro', function(req, res) {
		res.render('erro.ejs', {});
	});


	//Admin Side
	app.get('/configuracoes/admin/', isLoggedIn, function(req, res) {
		res.render('admin.ejs', {
			user : req.user
		});
	});


	//API SECTION //
	app.get('/api/genders/', function(req, res) {
		apis.listGenders(req, res);
	});

	app.get('/api/nationalities/', function(req, res) {
		apis.listNationalities(req, res);
	});

	app.get('/api/countries/', function(req, res) {
		apis.listCountries(req, res);
	});

	app.get('/api/states/:id', function(req, res) {
		apis.listStates(req, res);
	});

	app.get('/api/cities/:id', function(req, res) {
		apis.listCities(req, res);
	});

	app.get('/api/cities/', function(req, res) {
		apis.listAllCities(req, res);
	});

	app.get('/api/grounds/', function(req, res) {
		apis.listGrounds(req, res);
	});

	app.get('/api/player/positions', function(req, res) {
		apis.listPositionsByPlayer(req, res);
	});

	app.get('/api/positions/', function(req, res) {
		apis.listPositions(req, res);
	});

	app.get('/api/configuracoes/dependentes', isLoggedIn, function(req, res) {
		users.listDependents(req, res);
	});

	app.get('/api/positions/:id', function(req, res) {
		apis.listPositionsByGround(req, res);
	});

	app.get('/api/times/categorias', function(req, res) {
		apis.listCategories(req, res);
	});

	app.get('/mkt/computar', function(req, res) {
		mkt.computeBanner(req, res);
	});

	app.get('/mkt/imprimir/:id', function(req, res) {
		mkt.showBanner(req, res);
	});

	app.post('/mkt/imprimir/:id', function(req, res) {
		mkt.showBanner(req, res);
	});

	app.post('/adm/tickets/novo', function(req, res) {
		adm.createTicket(req, res);
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		if(req._parsedUrl.query && req._parsedUrl.query.indexOf('redirect') > -1 && req._parsedUrl.path === '/entrar')
			res.redirect(req._parsedUrl.query.replace('redirect=',''));
		else
			return next();
	}
	res.redirect('/entrar?redirect='+req._parsedUrl.path);
}
