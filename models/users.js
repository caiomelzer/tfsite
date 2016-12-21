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
var upload = multer({ storage : storage}).single('picture');
connection.init();

function Users() {
	this.update = function(req, res) {
		upload(req, res, function(err) {
			if(err) {
	        	return res.end("Error uploading file.");
	        }
	        
	        if(fileInfo != '') req.body.picture = fileInfo;
	        var data = [req.body, req.user.username];
			connection.acquire(function(err, con){
		    	con.query('update users set ? where username = ?', data, function(err, result){
					if(req.body.password != null && req.body.password != ''){
						con.query('update users set password = ? where username = ?', [bcrypt.hashSync(req.body.password, null, null), req.user.username], function(err, result){
							con.release();
						});
					}
					else{
						con.query('update users set password = ? where username = ?', [bcrypt.hashSync(req.body.password, null, null), req.user.username], function(err, result){
							con.release();
						});
					}
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success'});
				});
			});
		});
	},
	this.check = function(req,res){
		if(req.body.username){
			connection.acquire(function(err, con){
				con.query('select username from users where username = ?', req.body.username, function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						if(result.length>0)
							res.send({status: 1, message: 'Success', avaliable: false});
						else
							res.send({status: 1, message: 'Success', avaliable: true});
				});
			});
		}
		else{
			res.send({status: 0, message: 'failed to load data'});
		}
	},
	this.listDependents = function(req,res){
		if(req.user.id){
			connection.acquire(function(err, con){
				con.query('select * from vw_users where resp_id = ? order by last_login desc', req.user.id, function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success', data: result});
				});
			});
		}
		else{
			res.send({status: 0, message: 'failed to load data'});
		}
	}
	this.createDependents = function(req, res){
		if(req.user.id){
			connection.acquire(function(err, con){
				con.query('INSERT INTO users ( email, resp_id, username, password ) values (?, ?,?,?)', [req.user.email, req.user.id , req.body.username, bcrypt.hashSync(req.body.password, null, null)], function(err, result){
					if(err)
						res.send({status: 0, message: err});
					else
						res.send({status: 1, message: 'Success'});
				});
			});
		}
		else{
			res.send({status: 0, message: 'failed to load data'});
		}
	}
	this.updateDependents = function(req, res){
		connection.acquire(function(err, con){
			if(req.body.status === 'true')
				req.body.status = 1;
			else
				req.body.status = 0;
			con.query('update users set status = ? where id = ? and resp_id = ?', [req.body.status, req.body.id, req.user.id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
		});
	}
}

module.exports = new Users();
