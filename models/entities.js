var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
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
	this.read = function(req, res) {
		if(req.user.id){
			connection.acquire(function(err, con){
				con.query('select * from entities where resp_id = ? order by full_name asc', req.user.id, function(err, result){
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
	}
}
module.exports = new Entities();
