// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs', {lang: res}); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/entrar', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('entrar.ejs', { lang: res, message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/entrar', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/entrar', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/registrar', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('registrar.ejs', { lang: res, message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/registrar', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/registrar', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			lang : res, 
			user : req.user // get the user out of session and pass to template
		});
	});


	// =====================================
	// SITE =========================
	// =====================================

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


	app.get('/cv', function(req, res) {
		res.render('cv.ejs', {});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
