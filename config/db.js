// exports.mysql = { 
// 	host : 'rinker.kr',
// 	port : '3406',
// 	user : 'test',
// 	password : 'ttest'	
// };

// exports.test = '테스트';

// exports.people_db = 'repository';
// exports.peoplelist_table = 'people'
// exports.people_table = 'nate_people';

// MySQL database
exports.MYSQL = {
	CLIENT : {
		host : 'ami.hansh.kr',
		port : '3406',
		user : 'test',
		password : 'ttest'
	},
	PERSON : {
		DB    : 'repository',
		TABLE : 'people',
		LIMIT : 40
	},
	MUSIC : {
		DB    : 'repository',
		TABLE : 'nate_people'
	},
	MOVIE : {
		DB    : 'repository',
		TABLE : 'nate_people'
	},
	MAIN : {
		DB : 'ent',
		MUSIC : 'music',
		MOVIE : 'movie',
		PERSON : 'person',
	},
	QUERY : {
		DB    : 'log',
		TABLE : 'query'
	}
};

// Neo4J databse
exports.NEO4J = {
	HOST : 'http://203.247.161.50:7474',
	NODE : 'node',
	REL  : {  
		MUSIC : 'music',
		MOVIE : 'movie',
		ISSUE : 'isuue'
	},
	VAL  : { 
		NAME : 'name',
		BIRTH : 'birth',
		THUMB : 'thumb' 
	}
}
