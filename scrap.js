var Iconv = require('iconv').Iconv;
var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');
var jsdom = require('jsdom');
var request = require('request');

var mysqlUtil = module.exports = {
  getList: function(category, page, res) {
	  console.log('getlist');
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
	            var image = $item.find('.img img').attr('src');
	            var name = $item.find('.person').text();
	            var birth = $item.find('.birth').text();
	            var position = $item.find('.position').text();
	            var job = $item.find('.job').text();
	            var detail_url = $item.find('.detail a').attr('href');

	            if(detail_url!=undefined){
	              self.items.push({
	                name: name.trim(),
	                image: image.trim(),
	                birth: birth.trim(),
	                job: job.trim(),
	                position: position.trim(),
	                detail_url: detail_url.trim()
	              });
	            }
	          });
	          console.log(self.items);
	        }
	      );
	  })
	}
}