var Iconv = require('iconv').Iconv;
var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');
var jsdom = require('jsdom');
var request = require('request');
var strptime = require('micro-strptime').strptime;
var db = require('./db');

var krtime = function(time){
	if((time[time.indexOf('일')]=='일')){
		return strptime(String(time), '%Y년 %m월 %d일')
	}else if((time[time.indexOf('월')]=='월')){
		return strptime(String(time), '%Y년 %m월')
	}else if((time[time.indexOf('년')]=='년')){
		return strptime(String(time), '%Y년')
	}else{
		return;
	}
}

var mysqlUtil = module.exports = {

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
	getList: function(category, page, res) {

		console.log('Scrap : http://people.nate.com/dir_job.html?c=',category,'&s=PD&p=',page,"'");
		
		request({
			uri: 'http://people.nate.com/dir_job.html?c='+category+'&s=PD&p='+page,
			encoding: 'binary'
		}, function (error, response, body) {
				var self = this;
				//console.log('response: '+ response.statusCode);
				var html = body.toString();

				var buf = new Buffer(body.length);
				buf.write(body, 0, body.length, 'binary');
				html=iconv.convert(buf).toString();

				jsdom.env
				(
					html,
					["http://code.jquery.com/jquery.js"],
					function(errors, window) {
						var data = new Object();
						data.nate_page = page;
						var $ = window.$;
						$list = $('.dir-box').find('tbody tr');
						$list.each(function(i, item){
							var $item = $(item);
							data.nate_url = $item.find('.detail a').attr('href');
							if(data.nate_url!=undefined){
								data.thumb = $item.find('.img img').attr('src');
								data.name = $item.find('.person').text();
								data.birth = $item.find('.birth').text();
								data.agency = $item.find('.position').text();
								data.job = $item.find('.job').text();
								data.birth = krtime(data.birth);
								console.log('++PARSING++ Page :',data.nate_page,' DB : ',data.name.trim());
								db.people(data, res);
							}            
						});
					}
				);
		})
	},
	nateParsing: function(category, page, res) {
		console.log('Scrap : http://people.nate.com/dir_job.html?c=',category,'&s=PD&p=',page,"'");
		
		request({
			uri: 'http://people.nate.com/dir_job.html?c='+category+'&s=PD&p='+page,
			encoding: 'binary'
		}, function (error, response, body) {
				var self = this;
				//console.log('response: '+ response.statusCode);
				var html = body.toString();

				var buf = new Buffer(body.length);
				buf.write(body, 0, body.length, 'binary');
				html=iconv.convert(buf).toString();

				jsdom.env
				(
					html,
					["http://code.jquery.com/jquery.js"],
					function(errors, window) {
						var data = new Object();
						var $ = window.$;
						$list = $('.dir-box').find('tbody tr');
						$list.each(function(i, item){
							var $item = $(item);
							var href = $item.find('.detail a').attr('href');
							if(data.nate_url!=undefined){
								data[i].href = href;
								data[i].thumb = $item.find('.img img').attr('src');
								data[i].name = $item.find('.person').text();
								data[i].birth = $item.find('.birth').text();
								data[i].agency = $item.find('.position').text();
								data[i].job = $item.find('.job').text();
								data[i].birth = krtime(data[i].birth);
								console.log('++PARSING++ Page :',page,' DB :',data[i].name.trim());
							}            
						});
						db.page(data, page, res);
					}
				);
		})
	}		
}