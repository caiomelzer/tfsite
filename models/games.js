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
			con.query('select * from vw_games_invites where opponent_confirm = 1 and (resp_id = ? or resp_id_a = ?) and date > now() order by date asc; select * from vw_games_invites where opponent_confirm = 0 and resp_id = ? and date > now() order by date asc;  select * from vw_games_invites where opponent_confirm = 2 and resp_id = ? order by date asc; select * from vw_games where status = 3 and a_resp_id = ? order by date asc;', [req.user.id, req.user.id, req.user.id, req.user.id, req.user.id], function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					console.log(result);
					res.render('games-invites.ejs', {
						lang : res,
						user : req.user,
						games : result[0],
						invites: result[1],
						canceled: result[2],
						ended: result[3]
					});
				}
			});
			con.release();
		});
	},
	this.listAll = function(req, res){
		connection.acquire(function(err, con){
			var query = 'select * from vw_games where status = 3  order by date desc limit 0, 7; select * from vw_games where status = 1  order by date asc  limit 0, 7;';
			con.query(query, function(err, result){
				console.log(result[1]);
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
	this.listByTeam = function(req, res){
		connection.acquire(function(err, con){
			if(req.params.id){
				var query = 'select * from vw_games where status = 1 and (team_id = ? or opponent_id = ?) order by date desc limit 0, 7;';
				con.query(query, [req.params.id, req.params.id], function(err, result){
					if(err){
						res.send({status: 0, message: err});
					}
					else{
						res.send({status: 1, data: result});
					}
				});
				con.release();
			}	
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
			var query = 'select * from vw_games where date < DATE_FORMAT(NOW(),"%d-%m-%Y %h:%i") ';
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
				//con.query('select other_grounds from teams where id = ?', req.params.id, function(err, result){
					if(err){
						res.send({status: 0, message: err});
					}
					else{
						if(result[0].other_grounds !== null && result[0].other_grounds !== 0){
							con.query('select * from vw_places', function(err, result){
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
				//news.create()
				if(req.body.opponent_confirm === '1' ){
					con.query('update games set status = 1 where id = ?',  req.body.game_id, function(err, result){
						if(err)
							res.send({status: 0, message: err});
						else
							res.send({status: 1});
					});
				}
				else{
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1});
				}
				

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
				var query = 'SELECT final.player_id, gender, born, first_name, middle_name, last_name, resp_id, NAME, final.id, min_age, max_age, other_grounds, other_categories, age, picture,invites.player_confirm FROM ( SELECT GROUP_CONCAT(vw_players_positions_2.positions SEPARATOR ", ") AS positions, vw_players.player_id, vw_players.gender, vw_players.born, vw_players.first_name, vw_players.middle_name, vw_players.last_name, vw_players.resp_id, vw_teams.`name`, vw_teams.id, team_categories.min_age, team_categories.max_age, vw_teams.other_grounds, vw_teams.other_categories, timestampdiff( YEAR, vw_players.born, curdate() ) AS age, vw_players.picture FROM vw_games_invites INNER JOIN team_players ON team_players.team_id = vw_games_invites.team_id OR team_players.team_id = vw_games_invites.opponent_id INNER JOIN vw_players ON team_players.player_id = vw_players.player_id INNER JOIN vw_teams ON vw_teams.id = vw_games_invites.team_id OR vw_teams.id = vw_games_invites.opponent_id INNER JOIN team_categories ON vw_teams.category_id = team_categories.id INNER JOIN vw_players_positions_2 ON vw_players.player_id = vw_players_positions_2.player_id WHERE vw_games_invites.game_id = ? AND vw_teams.id = ? AND team_players.STATUS = 1 group by player_id) final INNER JOIN invites ON final.id = invites.team_id /*AND final.player_id = invites.player_id*/ WHERE invites.game_id = ?';
				con.query(query, [req.params.id, req.params.team_id, req.params.id], function(err, result){
					console.log(result);
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
			con.query('delete from invites where game_id = ? and  team_id = ? and player_id = ?; insert into invites set ?', [req.params.game_id, req.params.team_id,req.params.player_id, data], function(err, result){
				console.log(err, result);
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
	},
	this.result = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from vw_games where id = ? and status >= 1; select * from vw_games_results_team where game_id = ?; select * from vw_games_results_opponent where game_id = ?', [req.params.id,req.params.id,req.params.id], function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					console.log(result);
					res.render('sumula.ejs', {
						lang : res,
						user : req.user,
						games : result[0],
						players_a : result[1],
						players_b : result[2]
					});
				}
			});
			con.release();
		});
	},
	this.saveResult = function(req, res){
		connection.acquire(function(err, con){
			if(req.body.players){
				con.query('delete from games_results where game_id = ?', req.body.players[0].game_id, function(err, result){});
				con.query('update games set text = ?, status = 2, team_result = ?, opponent_result = ? where id = ?', [req.body.text, req.body.result.team_a, req.body.result.team_b, req.body.players[0].game_id], function(err, result){});
				for(var i=0; i<req.body.players.length; i++){
					con.query('insert into games_results set ?', req.body.players[i], function(err, result){
					});
				}
				console.log(req.body);
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'success'});
			}
			con.release();
		});
	},
	this.confirmResult = function(req, res){
		connection.acquire(function(err, con){
			if(req.body.players){
				if(req.params.result === 0)
					var query = 'update games set status = 4 where id = ?';
				else
					var query = 'update games set status = 3 where id = ?';
				con.query(query, [req.params.game_id], function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'success'});
				});
			}
			con.release();
		});
	}
	
}
module.exports = new Games();
