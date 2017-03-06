var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
var multer  = require('multer');
connection.init();

function Places() {
	this.create = function(req, res) {
		var data = {
        	name: req.body.name,
        	resp_id: req.user.id,
        	ground_id: req.body.ground_id,
        	status: 1
        };
        connection.acquire(function(err, con){
			con.query('insert into places set ?;', data, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
			con.release();
		});	
	},
	this.myPlaces = function(req, res){
		if(req.user.id){
			connection.acquire(function(err, con){
				con.query('select * from vw_places where status = 1 and resp_id = ? order by name asc', req.user.id, function(err, result){
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
	},
	this.list = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from vw_places where status = 1 order by name asc', function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success', data: result});
			});
			con.release();
		});
	},
	this.delete = function(req, res){
		connection.acquire(function(err, con){
			if(req.params.id && req.user.id){
				con.query('update places set status = 0 where id = ? and resp_id =?', [req.params.id, req.user.id],function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success', data: result});
				});
				con.release();
			}
		});
	}
}
module.exports = new Places();
