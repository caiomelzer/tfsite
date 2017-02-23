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
	this.read = function(req, res){
		if(req.params.id){
			connection.acquire(function(err, con){
				con.query('select * from entities where status = 1 and id = ? order by full_name asc', req.params.id, function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success', data: result});
				});
				con.release();
			});
		}
		else{
			connection.acquire(function(err, con){
				con.query('select * from entities where status = 1 order by full_name asc', function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success', data: result});
				});
				con.release();
			});
		}
	},
	this.list = function(req, res){	
		if(req.user.id){
			connection.acquire(function(err, con){
				con.query('select * from entities where status = 1 and resp_id = ? order by full_name asc', req.user.id, function(err, result){
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
	this.myEntities = function(req, res){	
		if(req.user.id){
			connection.acquire(function(err, con){
				con.query('select * from entities where status = 1 and resp_id = ? order by full_name asc', req.user.id, function(err, result){
					if(err)
						res.send({status: 0, message: 'failed to load data'});
					else
						res.render('agremiacoes-buscar-minhas.ejs', {
							lang : res,
							user : req.user,
							entities : result
						});
				});
				con.release();
			});
		}
		else{
			res.send({status: 0, message: 'failed to load data'});
		}
	},
	this.delete = function(req, res) {
		if(req.user.id && req.params.id){
			connection.acquire(function(err, con){
				con.query('update entities set status = 0 where resp_id = ? and id =?', [req.user.id, req.params.id], function(err, result){
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
	this.search = function(req, res){
		connection.acquire(function(err, con){
			var query = 'select distinct * from entities where status = 1 ';
			if(req.query.alias){ query += ' and alias like "%'+ req.query.alias+'%" '};
			if(req.query.name){ query += ' and full_name like "%'+ req.query.name+'%" '};
			if(req.query.city){ query += ' and city_id = '+ req.query.city };
			if(req.query.page){ query += ' limit '+req.query.page+', 30'}else{query += ' limit 0, 30'};
			con.query(query, function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.render('agremiacoes-buscar.ejs', {
						lang : res,
						user : req.user,
						entities : result
					});
			});
			con.release();
		});
	}
}
module.exports = new Entities();
