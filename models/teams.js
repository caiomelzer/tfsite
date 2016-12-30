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
        	resp_id: req.user.id
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
			if(req.query.page){ query += ' limit '+req.query.page+', 30'}else{query += ' limit 0, 30'};
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
			console.log(query);
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
	this.read = function(req, res) {
		if(req.user.id){
			if(req.params.id){
				connection.acquire(function(err, con){
					con.query('select * from teams where resp_id = ? and id = ? order by name asc', [req.user.id, req.params.id], function(err, result){
						if(err)
							res.send({status: 0, message: err});
						else
							res.send({status: 1, message: 'Success', data: result});
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
	        var data = [req.body, parseInt(req.params.id), req.user.id];
	        
	        console.log(data);
			connection.acquire(function(err, con){
		    	con.query('update teams set ? where id = ? and resp_id = ?', data, function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success'});
				});
			});
		});
	}
}
module.exports = new Teams();
