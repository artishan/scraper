var Iconv = require('iconv').Iconv,
		iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE'),
		jsdom = require('jsdom'),
		request = require('request'),
		strptime = require('micro-strptime').strptime,
		mysql = require('./mysql');
//		mapping = require('./mapping');

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

var map = new Object(); 
		map.natePerson = [
				['name','이름'],
				['thumb'],
				['real_name','본명'],
				['birth','출생','생일'],
				['job','직업','직장'],
				['team','소속그룹','팀'],
				['agency','소속사','소속','회사'],
				['body','신체'],
				['review','데뷔','직장'],
				['comunity','커뮤니티','모임','동호회'],
				['hobby','취미'],
				['specialty', '특기'],
				['homepage','홈페이지','홈피'],
				['cyworld','미니홈피','싸이월드'],
				['birthplace','출생지','고향'],
				['family','가족사항','가족'],
				['twitter','트위터'],
				['facebook','페이스북']
];

var mapping = function(obj, name){ 
		try{ 
			var result = 'error';
			var map  = obj.natePerson;
			var Break = new Error('Break');

			for (var i = map.length; i--;){
				var key = map[i][0];
				map[i].some(function(v) {
					if(v == name) {
						result = key;
						throw Break;
					}
				});
			}
			return result;
		}catch(e){
			if (e == Break) {
				e = key
				return result;
			}; 
			console.log('+ Mapping :',e);
		} 
}

var scrap = module.exports = {

	// Parsing to people.nate.co person
	nate_personParsing: function (id, url) {

	  request({
	    uri: url,
	    encoding: 'binary'
	  }, 

	  function (error, response, body) {
	      var self = this;
	      self.items = [];
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

	          $profile=$('#PersonInfo');

	          self.items.push({
	            key: 'name',
	            value: $profile.find('li.title').text()
	          });

	          self.items.push({
	            key: 'thumb',
	            value: $profile.find('img').attr('src')
	          });

	          $('#Profile li').each(function(i, item){
	            var $item = $(item);
	            var $tit = $item.find('em');
	            var $txt = $item.find('em').remove();
	            var key = $tit.text();
	            var value = $item.text();
	            if(key!=''){
	              self.items.push({
	                key: key.trim(),
	                value: value.trim()
	              });
	            }
	          });

	          $('.person-info').each(function(i, item){
	            if(i==0){
	               $(item).find('tr').each(function(i, item){
	                  var link = $(item).find('td a').attr('href');
	                  if(link!=undefined){
	                    self.items.push({
	                      key: $(item).find('th').text(),
	                      value: $(item).find('td').text(),
	                      link: link
	                    });    
	                  }else{
	                    self.items.push({
	                      key: $(item).find('th').text(),
	                      value: $(item).find('td').text()
	                    });   
	                  }    
	               });
	            }
	          });

	          var query='',
	          		TABLE='people',
	              COL ='',
	              VAL ='';

	          for (i = self.items.length; i--;){
	            var key = mapping(map, self.items[i].key);
	            var value = self.items[i].value;
	            if ( key!='' || value!=''|| key!='error'){
	              if(i==0) {
	                COL+= key;
	                VAL+= "'" + value + "'";
	              }else{
	                COL+= key + ",";
	                VAL+= '"' + value + '",';
	              }
	            }else{
	              COL+= 'error' + ",";
	              VAL+= "' Error key : " + self.items[i].value + ",value: " + value + "',";
	              console.log('\n\n ++++ Check! [', self.items[i].key, '] ++++ \n\n\n')
	            }
	          }

	          //MYSQL insert
	          query= 'INSERT INTO '+ TABLE +' (' + COL +') VALUES (' + VAL + ')';
	          console.log('\n +',query);
	          // client.query(query, function(error, results)
	          //   {
	          //     if(error) {
	          //         console.log("- Database query fail: " + error);
	          //         client.end();
	          //         return;
	          //     }
	          //     console.log(results.affectedRows + "row add.");
	          //     console.log("+++ ID add: " + results.insertId);
	          //   }
	          // );
	        }
	      );
		})
	},

	// Parsing to people.nate.com list
	nate_listParsing: function (category, page) {
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
						mysql.natePage(data);
						console.log(data);
					}
				);
		})
	}	
	
}