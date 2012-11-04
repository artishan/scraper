/*
 * GET home page.
 */
var scrap = require('../scrap');
var db = require('../db');

exports.error = function(req, res){
  res.render('error', { title: 'DATABASE ERROR', error: '에러' });
}

exports.index = function(req, res){
  res.render('index', { title: 'Scraper' });
};

exports.viewtList = function(req, res){
  scrap.getList('00010011', '1', res);
};

exports.getList = function(req, res){
  var start = req.param('s');
  var end = req.param('e');
  console.log('start:',start,' end:',end);
//3755
  if(start&&end){
   for(var i = start; i <= end; i++){
     scrap.getList('00010011', i, res);
   }
  }
};

exports.getPeople = function(req, res){
  var start = req.param('s');
  var end = req.param('e');
  //res.render('list', { title: 'Nate People', start:start, end:end });
  db.getPeople(start, end);
  //scrap.getPeople(start, end, res);
};

exports.nate_listParsing = function(req, res){
  var start = req.param('s');
  var end = req.param('e');
  res.render('list', { title: 'Scraper', start:start, end:end });
  console.log('start:',start,' end:',end);
//3755
  if(start&&end){
   for(var i = start; i <= end; i++){
     scrap.nate_listParsing('00010011', i, res);
   }
  }
};