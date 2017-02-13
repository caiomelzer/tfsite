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

function Teams() {
	this.create = function(req, res) {
		var data = {
        	alias: req.body.alias,
        	name: req.body.name,
        	resp_id: req.user.id,
        	category_id: req.body.category_id
        };
        connection.acquire(function(err, con){
			con.query('insert into teams set ?; update teams set slug = concat(replace(alias," ","-"),"_",id)', data, function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					con.query('update users set have_teams = (select count(1) from teams where resp_id = ?) where id = ?', [req.user.id, req.user.id], function(err, result){
						if(err)
							res.send({status: 0, message: err});
						else
							res.send({status: 1, message: 'Success'});
					});
				}
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
			if(req.query.category_id){ query += ' and category_id = "'+ req.query.category_id+'" '};
			if(req.query.ground && req.query.ground > 0){ query += ' and ground_id = "'+ req.query.ground+'" '};
			if(req.query.looking_games){ query += ' and looking_games = "'+ req.query.looking_games+'" '};
			if(req.query.open_for_new_players){ query += ' and open_for_new_players = "'+ req.query.open_for_new_players+'" '};
			if(req.query.other_grounds){ query += ' and other_grounds = "'+ req.query.other_grounds+'" '};
			if(req.query.other_categories){ query += ' and other_categories = "'+ req.query.other_categories+'" '};
			if(req.query.have_place){ query += ' and have_place = "'+ req.query.have_place+'" '};
			if(req.query.other_grounds){ query += ' and other_grounds = "'+ req.query.other_grounds+'" '};
			if(req.query.day && req.query.day !== ''){
				query += ' and '+req.query.day+' is not null '
				if(req.query.hour && req.query.hour !== ''){
					query += ' and TIME("'+req.query.hour+'") between REPLACE(SUBSTRING('+req.query.day+',0,5)," ","") and REPLACE(SUBSTRING('+req.query.day+',6,5)," ","")'
				}
			}
			else{
				if(req.query.hour && req.query.hour !== ''){
					query += ' and (TIME(d1 between REPLACE(SUBSTRING(d1,0,5)," ","") and REPLACE(SUBSTRING(d1,6,5)," ","") OR TIME(d2 between REPLACE(SUBSTRING(d2,0,5)," ","") and REPLACE(SUBSTRING(d2,6,5)," ","") OR TIME(d3 between REPLACE(SUBSTRING(d3,0,5)," ","") and REPLACE(SUBSTRING(d3,6,5)," ","") OR TIME(d4 between REPLACE(SUBSTRING(d4,0,5)," ","") and REPLACE(SUBSTRING(d4,6,5)," ","") OR TIME(d5 between REPLACE(SUBSTRING(d5,0,5)," ","") and REPLACE(SUBSTRING(d5,6,5)," ","") OR TIME(d6 between REPLACE(SUBSTRING(d6,0,5)," ","") and REPLACE(SUBSTRING(d6,6,5)," ","") OR TIME(d7 between REPLACE(SUBSTRING(d7,0,5)," ","") and REPLACE(SUBSTRING(d7,6,5)," ",""))';
				}
			}
			if(req.query.page){ query += ' limit '+req.query.page+', 30'}else{query += ' limit 0, 30'};
			console.log(query);
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
	}
	this.myTeams = function(req, res){
		connection.acquire(function(err, con){
			var query = 'select distinct * from teams where resp_id = '+req.user.id+' and name is not null ';
			if(req.query.alias){ query += ' and alias like "%'+ req.query.alias+'%" '};
			if(req.query.name){ query += ' and name like "%'+ req.query.name+'%" '};
			if(req.query.city){ query += ' and city_id = '+ req.query.city };
			if(req.query.page){ query += ' limit '+req.query.page+', 30'}else{query += ' limit 0, 30'};
			con.query(query, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.render('times-buscar-meus.ejs', {
						lang : res,
						user : req.user,
						teams : result,
						page : req.query.page
					});
			});
			con.release();
		});
	},
	this.editMyTeam = function(req, res){
		connection.acquire(function(err, con){
			con.query('select vw_teams.*, places.name as place from vw_teams left join places on places.id = vw_teams.preferred_place where vw_teams.id = ? and vw_teams.resp_id = ?; select * from team_players inner join vw_users on vw_users.id = team_players.player_id where team_id= ?', [req.params.id, req.user.id, req.params.id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.render('times-editar.ejs', {
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
	this.myTeamRemovePlace = function(req, res){
		con.query('update teams set preferred_place = null where resp_id = ? and id = ?', [req.user.id, req.params.id], function(err, result){
			if(err)
				res.send({status: 0, message: err});
			else
				res.send({status: 1, message: 'Success'});
		});
	},
	this.read = function(req, res) {
		if(req.user.id){
			if(req.params.id){
				connection.acquire(function(err, con){
					con.query('select * from teams where resp_id = ? and id = ? order by name asc', [req.user.id, req.params.id], function(err, result){
						if(err)
							res.send({status: 0, message: err});
						else
							res.send({status: 1, message: 'Success', data: result});
						console.log(result);
					});

					con.release();
				});
			}
			else{
				if(req.params.slug){
					connection.acquire(function(err, con){
						con.query('select * from vw_teams where slug = ? ', req.params.slug, function(err, result){
							if(err)
								res.send({status: 0, message: err});
							else
								res.render('time.ejs', {
									lang : res,
									user : req.user,
									teams : result
								});
							console.log(result);
						});
						con.release();
					});
				}
				else{
					connection.acquire(function(err, con){
						con.query('select * from teams where resp_id = ? order by name asc', req.user.id, function(err, result){
							if(err)
								res.send({status: 0, message: err});
							else
								res.send({status: 1, message: 'Success', data: result});
							console.log(result);
						});
						con.release();
					});
				}
			}
		}
		else{
			res.send({status: 0, message: 'Failed to load data'});
		}
	},
	this.update = function(req, res) {
		upload(req, res, function(err) {
			if(err) {
	        	return res.end("Error uploading file.");
	        }
	        if(fileInfo != '') req.body.logo = fileInfo;
	        delete req.body.country;
	        delete req.body.state;
	        delete req.body.tablePlayers_length;
	        req.body.days = req.body.days.replace(/\//g, '');
	        req.body.d1 = null;
	        req.body.d2 = null;
	        req.body.d3 = null;
	        req.body.d4 = null;
	        req.body.d5 = null;
	        req.body.d6 = null;
	        req.body.d7 = null;
	        var days = JSON.parse(req.body.days);
	        for(var i=0;i<days.length; i++){
				days[i] = JSON.parse(days[i]);
				if(days[i].duration !== '0:00'){
					if(days[i].day === 'd1')
						req.body.d1 = days[i].start+'|'+days[i].duration;
					if(days[i].day === 'd2')
						req.body.d2 = days[i].start+'|'+days[i].duration;
					if(days[i].day === 'd3')
						req.body.d3 = days[i].start+'|'+days[i].duration;
					if(days[i].day === 'd4')
						req.body.d4 = days[i].start+'|'+days[i].duration;
					if(days[i].day === 'd5')
						req.body.d5 = days[i].start+'|'+days[i].duration;
					if(days[i].day === 'd6')
						req.body.d6 = days[i].start+'|'+days[i].duration;
					if(days[i].day === 'd7')
						req.body.d7 = days[i].start+'|'+days[i].duration;
				}
			}        
			var data = [req.body, parseInt(req.params.id), req.user.id];
	        connection.acquire(function(err, con){
	        	con.query('update teams set days = replace(days,"\\","")', function(err, result){});
		    	con.query('update teams set ? where id = ? and resp_id = ?', data, function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success'});
				});
				con.release();
			});
		});
	},
	this.updatePlace = function(req, res) {
		connection.acquire(function(err, con){
			con.query('update teams set preferred_place = ? where id = ? and resp_id = ?', [req.params.place_id, req.params.id, req.user.id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
			con.release();
		});
	},
	this.disable = function(req, res) {
		var data = {
			id : req.params.id,
			resp_id : req.user.id
		};
		connection.acquire(function(err, con){
			con.query('update teams set status = 0 where id = ? and resp_id = ?', data, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
			con.release();
		});
	},
	this.follow = function(req, res) {
		var data = {
			team_id : req.params.id,
			user_id : req.user.id
		};	
		connection.acquire(function(err, con){
			con.query('insert into team_followers set ?', data, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
			con.release();
		});
	},
	this.unfollow = function(req, res) {
		connection.acquire(function(err, con){
			con.query('delete from team_followers where team_id = ? and user_id = ?', [req.params.id, req.user.id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
			con.release();
		});
	},	
	this.following = function(req, res) {
		connection.acquire(function(err, con){
			con.query('select * from team_followers where team_id = ? and user_id = ?', [req.params.id, req.user.id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success', data: result.length});
			});
			con.release();
		});
	},
	this.followers = function(req, res) {
		connection.acquire(function(err, con){
			con.query('select distinct count(1) from team_followers where team_id = ?', req.params.id, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success', data: result});
			});
			con.release();
		});
	},
	this.listPlayersAvaliable = function(req, res) {
		connection.acquire(function(err, con){
			if(req.params.id){
				con.query('SELECT vw_teams.ground_id, team_categories.max_age, team_categories.min_age FROM `vw_teams` left join team_categories on team_categories.id = vw_teams.category_id WHERE vw_teams.id = ?', req.params.id, function(err, age){
					if(err){
						res.send({status: 0, message: err});
					}
					else{
						con.query('select * from vw_players_list where player_id not in (select player_id from vw_players_list where player_id in (select player_id from team_players where team_id = ? group by player_id)) and age > ? and age < ? and ground_id = ?', [req.params.id, age[0].min_age, age[0].max_age, age[0].ground_id], function(err, result){
							if(err)
								res.send({status: 0, message: err});
							else
								res.send({status: 1, message: 'Success', data: result});
						});
					}	
				});
			}
			con.release();
		});
	},
	this.listPlayers = function(req, res) {
		connection.acquire(function(err, con){
			if(req.params.id){
				con.query('select * from vw_players_list where player_id  in (select player_id from team_players where team_id = ? group by player_id) and ground_id in (select ground_id from teams where id = ?)', [req.params.id, req.params.id], function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success', data: result});
				});
			}
			con.release();
		});
	},
	this.addPlayer = function(req, res) {
		var data = {
			team_id : req.params.team_id,
			player_id : req.params.id
		};	
		connection.acquire(function(err, con){
			con.query('insert into team_players set ?', data, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
			con.release();
		});
	},
	this.removePlayer = function(req, res) {
		connection.acquire(function(err, con){
			con.query('delete from team_players where team_id = ? and player_id = ?', [req.params.team_id, req.params.id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
			con.release();
		});
	},
	this.listMyTeams = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from teams', [req.params.team_id, req.params.id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
			con.release();
		});
	}
}
module.exports = new Teams();
