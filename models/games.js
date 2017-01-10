var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
var multer  = require('multer');
connection.init();

function Games() {
	this.invite = function(req, res) {
		var data = {
        	alias: req.body.alias,
        	name: req.body.name,
        	resp_id: req.user.id
        };
        connection.acquire(function(err, con){
			con.query('insert into teams set ?; update teams set slug = concat(replace(alias," ","-"),"_",id)', data, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
			con.release();
		});
		
	},
	this.search = function(req, res){
		connection.acquire(function(err, con){
			var query = 'select distinct * from teams where name is not null ';
			if(req.query.alias){ query += ' and alias like "%'+ req.query.alias+'%" '};
			if(req.query.name){ query += ' and name like "%'+ req.query.name+'%" '};
			if(req.query.city){ query += ' and city_id = '+ req.query.city };
			if(req.query.page){ query += ' limit '+req.query.page+', 30'}else{query += ' limit 0, 30'};
			con.query(query, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.render('times-buscar.ejs', {
						lang : res,
						user : req.user,
						teams : result,
						page : req.query.page
					});
			});
			con.release();
		});
	},
	this.myTeams = function(req, res){
		connection.acquire(function(err, con){
			con.query('select distinct * from teams where resp_id = ?', req.user.id, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
			con.release();
		});
	},
	this.places = function(req, res){
		connection.acquire(function(err, con){
			con.query('select distinct * from vw_places order by abr, city_name, name', function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
			con.release();
		});
	},
	this.invite = function(req, res){
		connection.acquire(function(err, con){
			var data = {
				team_id: req.body.eventteam,
				opponent_id: req.body.event_h_team,
				place_id: req.body.eventplace,
				date: req.body.event_h_date
			};
			con.query('insert into games set ?', data, function(err, result){
				console.log(result);
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					var data_b = {
						game_id: result.insertId,
						team_id: req.body.eventteam,
						opponent_id: req.body.event_h_team
					}
					con.query('insert into games_invites set ?', data_b, function(err, resultb){
						if(err){
							res.send({status: 0, message: err});
						}
						else{
							res.send({status: 1, data: resultb});
						}
					});
				}
			});
			con.release();
		});
	}

	
}
module.exports = new Games();