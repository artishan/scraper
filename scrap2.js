var Iconv = require('iconv').Iconv;
var iconv = new Iconv('EUC-KR', 'UTF-8//TRANSLIT//IGNORE');
var jsdom = require('jsdom');
var request = require('request');
var XRegExp = require('xregexp').XRegExp;
var mysql = require('mysql');

var client = mysql.createClient({
    user : 'test',
    password : 'ttest',
    port : '3406'
});
 
var max_page=3710;
var category='00010011&s';


var DB = 'repository';
var TABLE = 'nate_people';


client.query('USE '+DB, function(error, results){
    if(error) {
        console.log("- Databse fail: " + error);
        return;
    }
    console.log("++ DATABASE USE ",DB);
});


var obj = new Object(); 
    obj.map = [
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


function GetList(page){
  console.log(page);
  
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
                detail_url: detail_url
              });
              GetData(detail_url);
            }
          });
          console.log(self.items);
          
        }
      );
  })
}



function GetData(url){

  console.log('+ GetData :',url);

  request({
    uri: url,
    encoding: 'binary'
  }, function (error, response, body) {
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

          // $('h3.info').each(function(i, item){
          //     var $item = $(item);
          //     console.log($item.text());
          // });

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
              COL ='',
              VAL ='';

          for (i = self.items.length; i--;){
            var key = mapping(obj, self.items[i].key);
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
          client.query(query, function(error, results)
            {
              if(error) {
                  console.log("- Database query fail: " + error);
                  client.end();
                  return;
              }
              console.log(results.affectedRows + "row add.");
              console.log("+++ ID add: " + results.insertId);
            }
          );



        }
      );
  })
}

// function mysql(qeury){

//   client.query(query, function(error, results)
//     {
//       if(error) {
//           console.log("- Database query fail: " + error);
//           client.end();
//           return;
//       }
//       console.log(results.affectedRows + "row add.");
//       console.log("+++ ID add: " + results.insertId);
//     }
//   );

// }



// hash로 구현후에
// 매칭 된 결과물은 끊어버리기

function mapping(obj, name){ 
    try{ 
      var result= 'error';
    var map  = obj.map;
    var Break = new Error('Break');

    for (var i = map.length; i--;){
      var key = map[i][0];
      map[i].some(function(v) {
        if(v == name) {
          result=key;
          throw Break;
        }
        });
    }
        return result;
    }catch(e){
      if (e== Break) {
        e=key
        return result;
      }; 
      console.log('+ Mapping :',e);
    } 
}

// max_page=3;

// for(var i = 0; i <= max_page; i++){
//     console.log("GetList"+i);
//     GetList(i);
// }
//11까지 했음
GetList(21);
//GetData('http://people.nate.com/people/info/ba/ck/backyelin_15/');


//INSERT INTO nate_people (homepage,review,body,agency,job,birth,thumb,name) VALUES ('http://www.smilecompany.kr/sub/sub2_1_1.php','2012년 싱글 앨범 Herrah's','157cm, 44kg, B형','에스마일컴퍼니','가수','1989년','http://img.nate.com/star_sm/info/ki/ms/kimsojeong/photo/003.jpg','김소정')l
