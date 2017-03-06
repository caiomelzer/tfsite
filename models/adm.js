var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
connection.init();

function Adm() {
	this.createTicket = function(req, res) {
		var data = {
        	name: req.body.name,
        	email: req.body.email,
        	title: req.body.title,
        	status: 0
        };
        if(req.user){
        	data.user_id = req.user.id;
        }
        connection.acquire(function(err, con){
			con.query('insert into adm_tickets set ?', data, function(err, result){
				if(err){
					res.send({status: 0, message: err});
				}
				else{
					var dataMessage = {
						message_cli: req.body.message,
						ticket_id: result.insertId
					};
					con.query('insert into adm_tickets_history set ?', dataMessage, function(err, result){
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
module.exports = new Adm();
