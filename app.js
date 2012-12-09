var logo = '\n'
+'================================================================\n\n'
+'                        S C R A P E R                           \n\n'
+'----------------------------------------------------------------\n'
+'          AMI TEAM PROJECT : ENTERTAINMENT WEB CRAWLER          \n'
+'================================================================\n\n';
console.log(logo);
// Rinker for web crawler
// Rinekr : https://github.com/HanSeungHo/rinker

var io = require('socket.io').listen(3100);
var scrap = require('./lib/scrap');
var mysql = require('./lib/mysql');

// Debug level
io.set('log level', 1);

// Websocket Server
io.sockets.on('connection', function (client) {

	console.log('Rinker Socket.io client connected'); 
	client.emit('console', ' == Scraper Socket.io server connected');
	// people.nate.com page scrape
	client.on('nate list', function (data) {

		var start = data.start;
		var end = data.end;
		console.log(start, end);
		if (start && end) {
			for (var i = start; i <= end; i++) {
				 scrap.nate_listParsing('00010011', i);
				 client.emit('console', ' ++ people.nate.com : 페이지 ' + i + '수집');
			}
		}
		else {
			client.emit('console', ' -- Error: 수집할 페이지 시작과 끝을 입력해주세요.');
		};

	});

	// people.nate.com person scrape
	client.on('nate person', 
		function (data) {

			var start = data.start;
			var end = data.end;
			console.log(start, end);
			if (start && end){
				client.emit('console', ' ++ people.nate.com : 인물 id:' + start + '~' + end + ' 수집');
			  mysql.getPersonid(start, end,
				function (results) {
					for (x in results){
						scrap.nate_personParsing(results[x].id, results[x].nate_url);
			 			client.emit('console', ' ++ people.nate.com : 인물 id:' + results[x].id
			 									+ " URL: <a href='" + results[x].nate_url + "'>" + results[x].nate_url + "</a> 수집");
      		} 
			  });
			}
			else {
				client.emit('console', ' -- Error: 수집할 인물 시작과 끝을 입력해주세요.');
			};
		}
	);

});

