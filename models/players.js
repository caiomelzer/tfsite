var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
connection.init();

function Players() {
	this.create = function(req, res) {
		var dataUser = {
        	alias: req.body.alias,
        	looking_teams: req.body.looking_teams,
        	player_id: req.user.id,
        	open_for_invites: req.body.open_for_invites
        };
        connection.acquire(function(err, con){
			con.query('select * from players where user_id = ?', [req.user.id], function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					if(result.length>0){
						con.query('update players set ? where user_id = ?', [dataUser, req.user.id], function(err, result){
							if(err)
								res.send({status: 0, message: err});
							else
								res.send({status: 1, message: 'Success'});
						});
					}
					else{
						dataUser.user_id = req.user.id;
						con.query('insert into players set ?', dataUser, function(err, result){
							if(err)
								res.send({status: 0, message: err});
							else
								res.send({status: 1, message: 'Success'});
						});
					}
					con.query('delete from player_positions where player_id = ?', [req.user.id], function(err, result){
						if(err){
							console.log('dasdasda',err);
						}
						else{
							var data = {
								player_id : req.user.id,
								position_id : parseInt(req.body.position_id)
							};
							if(req.body.position_id && req.body.position_id !== undefined){
								if(typeof req.body.position_id === 'string'){
									con.query('insert into player_positions set ?', [data], function(err, result){});
								}
								else{
									var sqlQuery = '';
									for(var i=0; i<req.body.position_id.length; i++){
										sqlQuery += 'insert into player_positions values ('+req.user.id+','+req.body.position_id[i]+');';
									}
									con.query(sqlQuery, function(err, result){});
								}
							}
						}
					});
				}
				con.release();	
			});
		});
	}
	this.search = function(req, res){
		connection.acquire(function(err, con){
			var query = 'select distinct vw_users.* from vw_users inner join vw_player_postions on vw_player_postions.player_id = vw_users.id where is_player = 1 ';
			if(req.query.ground){ query += ' and ground_id = '+ req.query.ground};
			if(req.query.position){ query += ' and position_id = '+ req.query.position};
			if(req.query.min_age){ query += ' and ( age >= '+ req.query.min_age }else{ query += ' and ( age >= 1'};
			if(req.query.max_age){ query += ' and age <= '+ req.query.max_age+')' }else{ query += ' and age <= 100)'};
			if(req.query.name){ query += ' and alias like \'%'+req.query.name+'%\''};
			if(req.query.page){ query += ' limit '+req.query.page+', 30'}else{query += ' limit 0, 30'};
			con.query(query, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.render('jogadores-search.ejs', {
						lang : res,
						user : req.user,
						players : result,
						page: req.query.page
					});
			});
			con.release();
		});
	}
	this.read = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from vw_users where id = ? and is_player = 1; select * from vw_player_ground_postions where player_id = ?', [req.params.id, req.params.id] ,function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					if(result[0].length>0){
						res.render('jogador-perfil.ejs', {
							lang : res,
							user : req.user,
							players : result[0],
							positions : result[1]
						});
					}
					else{
						res.redirect('/404');
					}
				}
			});
			con.release();
		});
	}
}
module.exports = new Players();
