var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
var news = require('../models/news');
var multer  = require('multer');
var sendmail = require('sendmail')({silent: true});
var md5 = require('md5');
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

function Painel() {
	this.create = function(req, res) {
		var data = {
        	alias: req.body.alias,
        	name: req.body.name,
        	resp_id: req.user.id,
        	category_id: req.body.category_id,
        	entity_id: req.body.entity_id 
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
module.exports = new Painel();
