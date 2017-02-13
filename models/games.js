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
				con.query('select * from teams where id = ?', req.params.id, function(err, result){
					if(err){
						res.send({status: 0, message: err});
					}
					else{
						if(result[0].other_categories !== null && result[0].other_categories !== 0){
							con.query('select * from teams where resp_id = ?', [req.user.id], function(err, result){
								if(err)
									res.send({status: 0, message: err});
								else
									res.send({status: 1, data: result});
							});
						}
						else{
							con.query('select * from teams where resp_id = ? and category_id in (select category_id from teams where id = ?)', [req.user.id, req.params.id], function(err, result){
								if(err)
									res.send({status: 0, message: err});
								else
									res.send({status: 1, data: result});
							});
						}
					}
				});
				con.release();
			}
		});
	},
	this.list = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from vw_games_invites where opponent_confirm <> 1 and resp_id = ? and date > now() order by date asc', req.user.id, function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					console.log(result);
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
	this.listAll = function(req, res){
		connection.acquire(function(err, con){
			var query = 'select * from vw_games where status = 1 and date < DATE_FORMAT(NOW(),"%d-%m-%Y %h:%i") order by date desc limit 0, 7; select * from vw_games where status = 1 and date > DATE_FORMAT(NOW(),"%d-%m-%Y %h:%i") order by date asc  limit 0, 7;';
			con.query(query, function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					res.render('jogos.ejs', {
						lang : res,
						user : req.user,
						games_old : result[0],
						games : result[1]
					});
				}
			});
			con.release();
		});
	},
	this.listNext = function(req, res){
		connection.acquire(function(err, con){
			var query = 'select * from vw_games where status = 1 and date > DATE_FORMAT(NOW(),"%d-%m-%Y %h:%i") ';
			if(req.query.alias && req.query.alias.length > 0)
				query += ' and (alias_a LIKE "%'+req.query.alias+'%" or alias_b LIKE "%'+req.query.alias+'%") '; 
			if(req.query.city && req.query.city.length > 0)
				query += ' and city_id = "'+req.query.city+'" '; 
			if(req.query.ground && req.query.ground.length > 0)
				query += ' and ground_id = "'+req.query.ground+'" '; 
			if(req.query.category && req.query.category.length > 0)
				query += ' and (category_id_a = "'+req.query.category+'" or category_id_b = "'+req.query.category+'") ';
			query += ' order by date asc;';
			con.query(query, function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					res.render('games-all.ejs', {
						lang : res,
						user : req.user,
						games : result
					});
				}
			});
			con.release();
		});
	},
	this.listOlds = function(req, res){
		connection.acquire(function(err, con){
			var query = 'select * from vw_games where status = 1 and date < DATE_FORMAT(NOW(),"%d-%m-%Y %h:%i") ';
			if(req.query.alias && req.query.alias.length > 0)
				query += ' and (alias_a LIKE "%'+req.query.alias+'%" or alias_b LIKE "%'+req.query.alias+'%") '; 
			if(req.query.city && req.query.city.length > 0)
				query += ' and city_id = "'+req.query.city+'" '; 
			if(req.query.ground && req.query.ground.length > 0)
				query += ' and ground_id = "'+req.query.ground+'" '; 
			if(req.query.category && req.query.category.length > 0)
				query += ' and (category_id_a = "'+req.query.category+'" or category_id_b = "'+req.query.category+'") ';
			query += ' order by date desc;';
			con.query(query, function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					res.render('games-all.ejs', {
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
				con.query('select other_grounds from teams where id = ?', req.params.id, function(err, result){
					if(err){
						res.send({status: 0, message: err});
					}
					else{
						if(result[0].other_grounds !== null && result[0].other_grounds !== 0){
							con.query('select * from vw_places', req.params.id, function(err, result){
								if(err)
									res.send({status: 0, message: err});
								else
									res.send({status: 1, data: result});
							});
						}
						else{
							con.query('select * from vw_places where ground_id in (select ground_id from teams where id = ?)', req.params.id, function(err, result){
								if(err)
									res.send({status: 0, message: err});
								else
									res.send({status: 1, data: result});
							});
						}
						
					}
				});
				con.release();
			}
		});
	},
	this.answerInvite = function(req, res){
		connection.acquire(function(err, con){
			con.query('update games_invites set opponent_confirm = ? where game_id = ?', [req.body.opponent_confirm, req.body.game_id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1});
			});
			con.release();
		});
	},
	this.invitePlayer = function(req, res){
		connection.acquire(function(err, con){
			var data = {
				game_id: req.params.game_id,
				player_id: req.params.player_id,
				team_id: req.params.team_id,
				player_confirm:0
			};
			con.query('insert into invites set ?', data, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
			con.release();
		});
	},
	this.inviteListPlayers = function(req, res){
		connection.acquire(function(err, con){
			if(req.params.id && req.params.team_id){
				var query = 'select player_id, gender, born, first_name, middle_name, last_name, resp_id, name, id, min_age, max_age, other_grounds, other_categories, age, picture,GROUP_CONCAT(positions SEPARATOR ", ") as positions from (SELECT vw_players.player_id, vw_players.gender, vw_players.born, vw_players.first_name, vw_players.middle_name, vw_players.last_name, vw_players.resp_id, vw_teams.`name`, vw_teams.id, team_categories.min_age, team_categories.max_age, vw_teams.other_grounds, vw_teams.other_categories, timestampdiff(YEAR,vw_players.born,curdate()) AS age, vw_players.picture, vw_players_positions_2.positions FROM vw_games_invites LEFT JOIN team_players ON team_players.team_id = vw_games_invites.team_id OR team_players.team_id = vw_games_invites.opponent_id INNER JOIN vw_players ON team_players.player_id = vw_players.player_id INNER JOIN vw_teams ON vw_teams.id = vw_games_invites.team_id OR vw_teams.id = vw_games_invites.opponent_id INNER JOIN team_categories ON vw_teams.category_id = team_categories.id INNER JOIN vw_players_positions_2 ON vw_players.player_id = vw_players_positions_2.player_id WHERE vw_games_invites.game_id = ? AND vw_teams.id = ?) final';
				con.query(query, [req.params.id, req.params.team_id], function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, data: result});
				});
				con.release();
			}
		});
	},
	this.inviteListPlayersToGame = function(req, res){
		connection.acquire(function(err, con){
			var data = {
				game_id: req.params.game_id,
				player_id: req.params.player_id,
				team_id: req.params.team_id,
				player_confirm:0
			};
			con.query('insert into invites set ?', data, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
			con.release();
		});
	},
	this.cancelInviteListPlayersToGame = function(req, res){
		connection.acquire(function(err, con){
			con.query('delete from invites where game_id = ? and player_id = ? and team_id = ?', [req.params.game_id, req.params.player_id, req.params.team_id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
			con.release();
		});
	}
	
}
module.exports = new Games();
