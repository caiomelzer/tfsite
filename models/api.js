var bcrypt 		= require('bcrypt-nodejs');
var connection 	= require('../config/connection');
var i18n 		= require('i18n');
var util 		= require('../util.js');

connection.init();
console.log(connection);

function Apis() {
	this.listGenders = function(req, res) {
		connection.acquire(function(err, con){
			con.query('select * from genders where lang = ?', [i18n.getLocale()], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
				con.release();
			});
		});
	},

	this.listNationalities = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from countries where lang = ?', [i18n.getLocale()], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
				con.release();
			});
		});
	},
	
	this.listCountries = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from countries where lang = ?', [i18n.getLocale()], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
				con.release();
			});
		});
	},

	this.listStates = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from states where country_id = ? and lang = ?' , [req.params.id, i18n.getLocale()], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
				con.release();
			});
		});
	},

	this.listCities = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from cities where state_id = ?', [req.params.id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
				con.release();
			});
		});
	},

	this.listAllCities = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from vw_cities order by state_name, city_name', function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
				con.release();
			});
		});
	},

	this.listGrounds = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from grounds where lang = ?', [i18n.getLocale()], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
				con.release();
			});
		});
	},

	this.listPositionsByGround = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from positions where ground_id = ? and lang = ?', [req.params.id, i18n.getLocale()], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
				con.release();
			});
		});
	},

	this.listPositionsByPlayer = function(req, res){
		var player_id;
		if(req.params.id)
			player_id = req.params.id;
		else
			player_id = req.user.id;
		connection.acquire(function(err, con){
			con.query('select * from vw_player_postions where lang = ? and player_id = ?', [i18n.getLocale(), player_id], function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
				con.release();
			});
		});
	},

	this.listPositions = function(req, res){
		connection.acquire(function(err, con){
			con.query('select id, name from grounds where lang = ? order by name; select * from vw_positions where lang = ?', [i18n.getLocale(), i18n.getLocale()], function(err, result){
				var grounds = result[0];
				var positions = result[1];
				for(var i=0; i<grounds.length; i++){
					grounds[i].positions = [];
				}
				for(var i in grounds){
					for(var j in positions){
						if(grounds[i].id == positions[j].ground_id)
							grounds[i].positions.push(positions[j]);
					}
				}
				res.send({status: 1, data: grounds});
			});
			con.release();
		});
	},
	this.listCategories = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from team_categories where lang = ?', i18n.getLocale(), function(err, result){
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
			con.release();
		});
	},
	

	this.analytics = function(req, res){
		console.log(req);
	}
}

module.exports = new Apis();
