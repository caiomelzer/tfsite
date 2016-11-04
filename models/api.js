var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
var i18n 	= require('i18n');

connection.init();

function Apis() {
	this.listGenders = function(req, res) {
		connection.acquire(function(err, con){
			con.query('select * from genders where lang = ?', [i18n.getLocale()], function(err, result){
				con.release();
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
		});
	}

	this.listNationalities = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from countries where lang = ?', [i18n.getLocale()], function(err, result){
				con.release();
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
		});
	}
	
	this.listCountries = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from countries where lang = ?', [i18n.getLocale()], function(err, result){
				con.release();
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
		});
	}

	this.listStates = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from states where country_id = ? and lang = ?' , [req.params.id, i18n.getLocale()], function(err, result){
				con.release();
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
		});
	}

	this.listCities = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from cities where state_id = ?', [req.params.id], function(err, result){
				con.release();
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
		});
	}

	this.listGrounds = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from grounds where lang = ?', [i18n.getLocale()], function(err, result){
				con.release();
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
		});
	}

	this.listPositions = function(req, res){
		connection.acquire(function(err, con){
			con.query('select * from positions where ground_id = ? and lang = ?', [req.params.id, i18n.getLocale()], function(err, result){
				con.release();
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, data: result});
			});
		});
	}
}

module.exports = new Apis();
