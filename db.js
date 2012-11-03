var config = require('./config'),
    mysql = require('mysql');
    client = mysql.createClient(config.mysql);

var mysqlUtil = module.exports = {
    people: function(data, res) {
      client.query('USE ' + config.people_db);
      client.query(
          'INSERT INTO ' + config.peoplelist_table + ' SET name = ?, thumb = ?, birth = ?, job = ?, agency = ?, nate_url = ?, nate_page = ?'
          , [data.name, data.thumb, data.birth, data.job, data.agency, data.nate_url, data.nate_page]
          , function(err, rows, fields) {
            if (err) {
              console.log(data.name,err);
              return; 
            } 
            console.log('++DB INSERT++ Page :',data.nate_page,' DB : ',data.name.trim());
          }
      );
      client.end();
  },
   page: function(data, page, res) {
      client.query('USE ' + config.people_db);
      
      for (var i = data.length; i--;){
        client.query(
            'INSERT INTO ' + config.peoplelist_table + ' SET name = ?, thumb = ?, birth = ?, job = ?, agency = ?, nate_url = ?, nate_page = ?'
            , [data[i].name, data[i].thumb, data[i].birth, data[i].job, data[i].agency, data[i].nate_url, data[i].nate_page]
            , function(err, rows, fields) {
                if (err) {
                  console.log(data[i].name,err);
                  return; 
                }
                console.log('++DB INSERT++ People:',data.name);
            }
        );
      }
      client.end();
      console.log('++DB INSERT++ Page:', page);
    }  
};
