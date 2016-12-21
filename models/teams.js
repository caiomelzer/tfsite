var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
connection.init();

function Teams() {
	this.create = function(req, res) {
		var data = {
        	alias: req.body.alias,
        	name: req.body.name,
        	resp_id: req.user.id
        };
        connection.acquire(function(err, con){
			con.query('insert into teams set ?', data, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
		});
	},
	this.read = function(req, res) {
		if(req.user.id){
			connection.acquire(function(err, con){
				con.query('select * from teams where resp_id = ? order by name asc', req.user.id, function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success', data: result});
				});
			});
		}
		else{
			res.send({status: 0, message: 'Failed to load data'});
		}
	}
}
module.exports = new Teams();
