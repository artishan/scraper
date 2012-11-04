var config = require('../config/db'),
		mysql = require('mysql');
		client = mysql.createClient(config.mysql),
		scrap = require('./scrap');

var mysqlUtil = module.exports = {
	getPeople: function(start, end, res) {
		var row = [];
		client.query('USE ' + config.people_db);
		var sql ='SELECT * FROM ' + config.peoplelist_table + ' LIMIT ' + start +', ' + end;
		client.query(
				sql
				, function(err, rows, fields) {
					if (err) {
						console.log('\n--DB ERROR-- page:',data.nate_page,'\nSQL:',err.sql,'\nError:',err.message);
						return; 
					} 
					console.log('\n++DB SELECT++ SQL:', sql, "\n");
					row = rows;
					res.render('nateList', { title: 'Nate People' });
				}
		);
		console.log(row);
		res.render('nateList', { title: 'Nate People', rows:row });
	},	
	natePeople: function(data, res) {
		client.query('USE ' + config.people_db);
		client.query(
				'INSERT INTO ' + config.peoplelist_table + ' SET name = ?, thumb = ?, birth = ?, job = ?, agency = ?, nate_url = ?, nate_page = ?'
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
	natePage: function(data, res) {
		client.query('USE ' + config.people_db);
		for (var i = 0, len = data.length; i < len; i++){
			client.query(
					'INSERT INTO ' + config.peoplelist_table + ' SET name = ?, thumb = ?, birth = ?, job = ?, agency = ?, nate_url = ?, nate_page = ?'
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
