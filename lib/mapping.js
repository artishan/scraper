
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
