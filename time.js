// var strptime = require('micro-strptime').strptime;

// strptime('05/May/2012:09:00:00 +0900', '%d/%B/%Y:%H:%M:%S %Z');
// var time = "1974년 04월 30일";
// var time2 = "1974년 04월";
// var time3 = "1974년";

// // var year = time.split("년");
// // var month = time.split("월");
// // var day = time.split("일");
// // console.log(year, month, day);

// var re = new RegExp("/일/");
// console.log((time[time.indexOf('월')]=='월'))
// console.log((time[time3.indexOf('일')]=='일'))

// console.log('tetst',time.replace(re, '+$&+'));
// console.log(re.test(time));

// var krtime = function(time){
// 	if((time[time.indexOf('일')]=='일')){
// 		return strptime(String(time), '%Y년 %m월 %d일')
// 	}else if((time[time.indexOf('월')]=='월')){
// 		return strptime(String(time), '%Y년 %m월')
// 	}else{
// 		return strptime(String(time), '%Y년')
// 	}	
// }



// console.log(time, krtime(time));
// console.log(time2, krtime(time2));
// console.log(time3, krtime(time3));



// // console.log(time.indexOf('년'));
// // console.log(time.indexOf('월'));
// // console.log(time.indexOf('일'));
var re = new RegExp("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>");
var re2 = new RegExp("/^Subject:(.*)$/");
var html = "<span>탤런트</span><br /><span>모델</span><br />'";
console.log(html.replace(re,""));
console.log(html.replace(re2,"")) 
console.log(html);

var myRe=/d(b+)(d)/ig; 
var checked = myRe.test("cdbBdbsbz"); 
console.log("checked = " + checked +";<br>");
