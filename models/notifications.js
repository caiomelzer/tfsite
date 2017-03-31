var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
var news = require('../models/news');
var multer  = require('multer');
var sendmail = require('sendmail')({silent: true});
var md5 = require('md5');
var fileInfo = '';
connection.init();

function Notifications() {
	this.list = function(req, res) {
		connection.acquire(function(err, con){
			con.query('select * from team_players inner join vw_teams on vw_teams.id = team_players.team_id where player_id = ? and team_players.status = 0; select * from invites inner join vw_teams on vw_teams.id = invites.team_id inner join vw_games on vw_games.id = invites.game_id where invites.player_id = ? and vw_games.date < now(); select distinct * from vw_games_result_score where resp_id = ? and status = 2 order by id', [req.user.id, req.user.id, req.user.id], function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					console.log(result);
					
					res.render('notificacoes.ejs', {
						lang : res,
						user : req.user,
						notifications: result[0],
						invites: result[1],
						games: result[2]
					});
				}
			});
			con.release();
		});
	}

	
}
module.exports = new Notifications();
