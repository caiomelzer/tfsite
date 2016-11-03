var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
connection.init();
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

function Players() {
	this.create = function(req, res) {
		upload(req, res, function(err) {
			if(err) {
	        	return res.end("Error uploading file.");
	        }
	        if(fileInfo != '') req.body.picture = fileInfo;
	        var data = req.body;
			connection.acquire(function(err, con){
				con.query('select * from vw_players where user_id = ?', [req.user.id], function(err, result){
					con.release();
					if(err){
						res.send({status: 0, message: err});
					}
					else{

						if(result.length>0){
							con.query('update players set ? where user_id = ?', [data, req.user.id], function(err, result){
								if(err)
									res.send({status: 0, message: err});
								else
									res.send({status: 1, message: 'Success'});
							});
						}
						else{
							data.user_id = req.user.id;
							con.query('insert into players set ?', data, function(err, result){
								if(err)
									res.send({status: 0, message: err});
								else
									res.send({status: 1, message: 'Success'});
							});
						}
					}	
				});
			});
		});
	}
	this.read = function(req, res){
		connection.acquire(function(err, con){
			var query = 'select * from vw_users where is_player = 1 ';
			if(req.query.ground){ query += ' and ground_id = '+ req.query.ground};
			if(req.query.min_age){ query += ' and ( age >= '+ req.query.min_age }else{ query += ' and ( age >= 1'};
			if(req.query.max_age){ query += ' and age <= '+ req.query.max_age+')' }else{ query += ' and age <= 100)'};
			if(req.query.name){ query += ' and alias like \'%'+req.query.name+'%\''};
			if(req.query.page){ query += ' limit '+req.query.page+', 30'}else{query += ' limit 0, 30'};
			con.query(query, function(err, result){
				con.release();
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
		});
	}
}

module.exports = new Players();
