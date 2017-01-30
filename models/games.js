var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
var multer  = require('multer');
connection.init();

function Games() {
	this.myInvites = function(req, res){
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
	this.possibleOpponents = function(req, res){
		connection.acquire(function(err, con){
			if(req.params.id){
				con.query('select * from teams where resp_id = ? and category_id in (select category_id from teams where id = ?)', [req.user.id, req.params.id], function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, data: result});
				});
				con.release();
			}
		});
	},
	this.list = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from vw_games_invites where resp_id = ? and date > now() order by date asc', req.user.id, function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					res.render('games-invites.ejs', {
						lang : res,
						user : req.user,
						games : result
					});
				}
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
	},
	this.listPlaces = function(req, res){
		connection.acquire(function(err, con){
			if(req.params.id){
				con.query('select * from vw_places where ground_id in (select ground_id from teams where id = ?)', req.params.id, function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, data: result});
				});
				con.release();
			}
		});
	},
	this.answerInvite = function(req, res){
		connection.acquire(function(err, con){
			var data = {
				opponent_confirm: req.body.opponent_confirm,
				game_id: req.body.game_id
			};
			con.query('update games_invites set opponent_confirm = ? where game_id = ?', data, function(err, result){
				console.log(data);
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1});
			});
			con.release();
		});
	}

	

	
}
module.exports = new Games();
