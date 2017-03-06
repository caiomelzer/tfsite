var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
var multer  = require('multer');
var fileInfo = '';
var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './public/images/uploads');
	},
	filename: function (req, file, callback) {
		fileInfo = Date.now() + '-' + file.originalname;
		callback(null, fileInfo);
	}
});
var upload = multer({ storage : storage}).single('logo');
connection.init();

function Entities() {
	this.create = function(req, res) {
		var data = {
        	alias: req.body.alias,
        	full_name: req.body.full_name,
        	resp_id: req.user.id,
        	adm_id: req.user.id
        };
        connection.acquire(function(err, con){
			con.query('insert into entities set ?', data, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
			con.release();
		});
	},
	this.read = function(req, res){
		if(req.params.id){
			connection.acquire(function(err, con){
				con.query('select * from vw_entities where status = 1 and id = ? order by full_name asc; select * from vw_teams where entity_id  = ?; select vw_users.* from vw_users inner join team_followers on team_followers.user_id = vw_users.id where team_followers.team_id = ?; ', [req.params.id, req.params.id, req.params.id], function(err, result){
					console.log(err, result[0]);
					if(err)
						res.send({status: 0, message: err});
					else
						res.render('agremiacao.ejs', {
							lang : res,
							user : req.user,
							entities : result[0],
							teams: result[1],
							followers: result[2]
						});
				});
				con.release();
			});
		}
		else{
			connection.acquire(function(err, con){
				con.query('select * from entities where status = 1 order by full_name asc', function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success', data: result});
				});
				con.release();
			});
		}
	},
	this.list = function(req, res){	
		if(req.user.id){
			connection.acquire(function(err, con){
				con.query('select * from entities where status = 1 and resp_id = ? order by full_name asc', req.user.id, function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success', data: result});
				});
				con.release();
			});
		}
		else{
			res.send({status: 0, message: 'failed to load data'});
		}
	},
	this.myEntities = function(req, res){	
		if(req.user.id){
			connection.acquire(function(err, con){
				con.query('select * from entities where status = 1 and resp_id = ? order by full_name asc', req.user.id, function(err, result){
					if(err)
						res.send({status: 0, message: 'failed to load data'});
					else
						res.render('agremiacoes-buscar-minhas.ejs', {
							lang : res,
							user : req.user,
							entities : result
						});
				});
				con.release();
			});
		}
		else{
			res.send({status: 0, message: 'failed to load data'});
		}
	},
	this.delete = function(req, res) {
		if(req.user.id && req.params.id){
			connection.acquire(function(err, con){
				con.query('update entities set status = 0 where resp_id = ? and id =?', [req.user.id, req.params.id], function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success', data: result});
				});
				con.release();
			});
		}
		else{
			res.send({status: 0, message: 'failed to load data'});
		}
	},
	this.search = function(req, res){
		connection.acquire(function(err, con){
			var query = 'select distinct * from entities where status = 1 ';
			if(req.query.alias){ query += ' and alias like "%'+ req.query.alias+'%" '};
			if(req.query.name){ query += ' and full_name like "%'+ req.query.name+'%" '};
			if(req.query.city){ query += ' and city_id = '+ req.query.city };
			if(req.query.page){ query += ' limit '+req.query.page+', 30'}else{query += ' limit 0, 30'};
			con.query(query, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.render('agremiacoes-buscar.ejs', {
						lang : res,
						user : req.user,
						entities : result
					});
			});
			con.release();
		});
	},
	this.editMyEntity = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from entities where id = ? and resp_id = ?; select * from team_players inner join vw_users on vw_users.id = team_players.player_id where team_id= ?', [req.params.id, req.user.id, req.params.id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.render('agremiacao-editar.ejs', {
						lang : res,
						user : req.user,
						teams : result[0],
						players : result[1]
					});
				console.log(result);
			});
			con.release();
		});
	},
	this.update = function(req, res){
		upload(req, res, function(err) {
			if(err) {
	        	return res.end("Error uploading file.");
	        }
	        if(fileInfo != '') req.body.logo = fileInfo;
	        delete req.body.country;
	        delete req.body.state;
	        var data = [req.body, parseInt(req.params.id), req.user.id];
	        connection.acquire(function(err, con){
	        	con.query('update entities set ? where id = ? and resp_id = ?', data, function(err, result){
	        		if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success'});
				});
				con.release();
			});
		});
	}

}
module.exports = new Entities();
