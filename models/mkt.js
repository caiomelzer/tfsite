var bcrypt = require('bcrypt-nodejs');
var connection = require('../config/connection');
connection.init();

function Mkt() {
    this.showBanner = function(req, res) {
    	connection.acquire(function(err, con){
	        con.query('select * from mkt_banners where banner_type = ?', req.params.id, function(err, result){
	        	if(err){
					res.send({status: 0, message: err});
				}
				else{
					res.send({status: 1, content: '<img src="'+result[0].image+'" width="100%" /></div>'});
					var data = {
		            	banner_id: result[0].id,
		            	date: new Date(),
		            	page: req.headers.referer
		            };
		            con.query('insert into mkt_banners_report set ?', data, function(err, result){});
				}
			});
			con.release();
		});
	}
}
module.exports = new Mkt();
