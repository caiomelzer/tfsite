var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');

connection.init();

function Users() {
	this.update = function(req, res) {
		var data = [req.body, req.user.email];
	    connection.acquire(function(err, con){
	    	con.query('update users set ? where email = ?', data, function(err, result){
				if(req.body.password != null && req.body.password != ''){
					con.query('update users set password = ? where email = ?', [bcrypt.hashSync(req.body.password, null, null), req.user.email], function(err, result){
						con.release();
					});
				}
				else{
					con.query('update users set password = ? where email = ?', [req.user.password, req.user.email], function(err, result){
						con.release();
					});
				}
				if(err)
					res.send({status: 0, message: err});
				else
					res.send({status: 1, message: 'Success'});
			});
		});
	}

}

module.exports = new Users();
