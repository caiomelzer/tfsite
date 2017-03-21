// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
var i18n    = require('i18n');
var nodemailer = require('nodemailer');
var sendmail = require('sendmail')({silent: true});
var md5 = require('md5');

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM vw_users WHERE id = ?",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM vw_users WHERE username = ? and status = 1",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)
                    };

                    var insertQuery = "INSERT INTO users ( email, username, password, status, hash ) values (?,?,?, 0, ?)";

                    connection.query(insertQuery, [req.body.email , newUserMysql.username, newUserMysql.password, md5(newUserMysql.username)],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });

                    sendmail({
                        from: 'contato@terradofutebol.com.br',
                        to: req.body.email,
                        subject: 'Bem-indo',
                        text: 'Olá, seu cadastro foi efetivado com sucesso, agora basta copiar o link abaixo e colocar no navegador para você poder começar a utilizar nosso site<br/>http://localhost:8080/'+newUserMysql.username+'/'+md5(newUserMysql.username)+'<br/>...Abraços!', 
                        html: '<h2>Olá, </h2><p>seu cadastro foi efetivado com sucesso, e você ja pode utilzar nosso site...</p><p>Abraços!</p>' // html body 
                    }, 
                    function (err, reply) {
                        console.log(err && err.stack)
                        console.dir(reply)
                    });


                    
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM vw_users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                connection.query("UPDATE users SET last_login = NOW() where id = ?", rows[0].id ,function(err, rows) {
                    
                });

                return done(null, rows[0]);
            });
        })
    );
};
