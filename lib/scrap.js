var Iconv = require('iconv').Iconv;
var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');
var jsdom = require('jsdom');
var request = require('request');
var strptime = require('micro-strptime').strptime;
var db = require('../db');

var krtime = function(time){
	if(time.indexOf('일') != -1){
		return strptime(String(time), '%Y년 %m월 %d일')
	}else if(time.indexOf('월') != -1){
		return strptime(String(time), '%Y년 %m월')
	}else if(time.indexOf('년') != -1){
		return strptime(String(time), '%Y년')
	}else{
		return;
	}
}

var scrap = module.exports = {

	viewList: function(category, page, res) {
		console.log('Scrap : http://people.nate.com/dir_job.html?c=',category,'&s=PD&p=',page,"'");

		request({
			uri: 'http://people.nate.com/dir_job.html?c='+category+'&s=PD&p='+page,
			encoding: 'binary'
		}, function (error, response, body) {
				var self = this;
				self.items = [];
				console.log('response: '+ response.statusCode);
				var html = body.toString();

				var buf = new Buffer(body.length);
				buf.write(body, 0, body.length, 'binary');
				html=iconv.convert(buf).toString();

				jsdom.env
				(
					html,
					["http://code.jquery.com/jquery.js"],
					function(errors, window) {
						var $ = window.$;
						$list = $('.dir-box').find('tbody tr');
						$list.each(function(i, item){
							var $item = $(item);
							var thumb = $item.find('.img img').attr('src');
							var name = $item.find('.person').text();
							var birth = $item.find('.birth').text();
							var agency = $item.find('.position').text();
							var job = $item.find('.job').text();
							var nate_url = $item.find('.detail a').attr('href');
							if(nate_url!=undefined){
								self.items.push({
									name: name,
									thumb: thumb,
									birth: krtime(birth),
									job: job,
									agency: agency,
									nate_url: nate_url
								});
							}
							
						});

						console.log(self.items);
						res.render('list', { title: 'GetPeople List', list : self.items });
					}
				);
		})
	},

	getPeople: function(start, end, res) {
		db.getPeople(start, end);
	},

	test: function(rows, res) {
		console.log(rows);
		
		// request({
		// 	uri: url,
		// 	encoding: 'binary'
		// }, function (error, response, body) {
		// 		//console.log('response: '+ response.statusCode);
		// 		var buf = new Buffer(body.length);
		// 		buf.write(body, 0, body.length, 'binary');
		// 		var html=iconv.convert(buf).toString();
				
		// 		var data = [];
		// 		data.nate_page = page;
		// 		jsdom.env
		// 		(
		// 			html,
		// 			["http://code.jquery.com/jquery.js"],
		// 			function(err, window) {
						
		// 				var $ = window.$;
		// 				$list = $('.dir-box>tbody>tr');
		// 				$list.each(function(i, item){
		// 					var $item = $(item);
		// 						data.push({									
		// 							name : $item.find('.person').text().trim(),
		// 							thumb : $item.find('.img img').attr('src'),
		// 							birth : krtime($item.find('.birth').text()),
		// 							agency : $item.find('.position').text(),
		// 							job : $item.find('.job').text(),
		// 							nate_url : $item.find('.detail a').attr('href')
		// 						});
		// 						console.log('++PARSING++ page :',data.nate_page,'-',i,' name:',data[i].name);            
		// 				});
		// 				db.natePeople(data, res);
		// 			}
		// 		);
		// })
	},

	nate_listParsing: function(category, page, res) {
		console.log('Scrap : http://people.nate.com/dir_job.html?c=',category,'&s=PD&p=',page);
		
		request({
			uri: 'http://people.nate.com/dir_job.html?c='+category+'&s=PD&p='+page,
			encoding: 'binary'
		}, function (error, response, body) {
				//console.log('response: '+ response.statusCode);
				var buf = new Buffer(body.length);
				buf.write(body, 0, body.length, 'binary');
				var html=iconv.convert(buf).toString();
				
				var data = [];
				data.nate_page = page;
				jsdom.env
				(
					html,
					["http://code.jquery.com/jquery.js"],
					function(err, window) {
						
						var $ = window.$;
						$list = $('.dir-box>tbody>tr');
						$list.each(function(i, item){
							var $item = $(item);
								data.push({									
									name : $item.find('.person').text().trim(),
									thumb : $item.find('.img img').attr('src'),
									birth : krtime($item.find('.birth').text()),
									agency : $item.find('.position').text(),
									job : $item.find('.job').text(),
									nate_url : $item.find('.detail a').attr('href')
								});
								console.log('++PARSING++ page :',data.nate_page,'-',i,' name:',data[i].name);            
						});
						db.natePage(data, res);
					}
				);
		})
	}	

}