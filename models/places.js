var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
var multer  = require('multer');
connection.init();

function Places() {
	this.create = function(req, res) {
		var data = {
        	name: req.body.name,
        	city_id: req.user.id
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
		
	}
}
module.exports = new Places();
