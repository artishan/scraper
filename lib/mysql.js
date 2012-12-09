var CONFIG = require('../config/db'),
		mysql = require('mysql');
		client = mysql.createClient(CONFIG.MYSQL.CLIENT),
		scrap = require('./scrap');

var mysqlUtil = module.exports = {

	getPersonid: function(start, end, callback) {
		client.query('USE ' + CONFIG.MYSQL.PERSON.DB);
		//SELECT id,name,nate_url FROM people LIMIT 0,10;
		client.query(
			"SELECT id,name,nate_url FROM " + CONFIG.MYSQL.PERSON.TABLE + " LIMIT " + start + "," + end,
			function(err, results, fields) {
				callback(results);
		});
	},

	natePerson: function(data, res) {
		client.query('USE ' + CONFIG.MYSQL.PERSON.DB);
		client.query(
				'INSERT INTO ' + CONFIG.MYSQL.PERSON.TABLE + ' SET name = ?, thumb = ?, birth = ?, job = ?, agency = ?, nate_url = ?, nate_page = ?'
				, [data.name, data.thumb, data.birth, data.job, data.agency, data.nate_url, data.nate_page]
				, function(err, rows, fields) {
					if (err) {
						console.log(data.name,err);
						return; 
					} 
					console.log('\n++DB INSERT++ Page :',data.nate_page,'\nDB : ',data.name.trim(),"\n");
				}
		);
	},

	natePage: function(data) {
		client.query('USE ' + CONFIG.MYSQL.PERSON.DB);
		for (var i = 0, len = data.length; i < len; i++){
			client.query(
					'INSERT INTO ' + CONFIG.MYSQL.PERSON.TABLE + ' SET name = ?, thumb = ?, birth = ?, job = ?, agency = ?, nate_url = ?, nate_page = ?'
					, [data[i].name, data[i].thumb, data[i].birth, data[i].job, data[i].agency, data[i].nate_url, data.nate_page]
					, function(err, rows, fields) {
							if (err) {
								console.log('\n--DB ERROR-- page:',data.nate_page,'\nSQL:',err.sql,'\nError:',err.message);
								return; 
							}
							console.log('++DB INSERT++ page:',data.nate_page,' id:',rows.insertId);
					}
			);
		}
	}
	
};
