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


exports.mapping = function(obj, name){ 
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
