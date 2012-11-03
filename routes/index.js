/*
 * GET home page.
 */
var config = require('../config'),
    scrap = require('../scrap');

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

exports.natelistParsing = function(req, res){
  var start = req.param('s');
  var end = req.param('e');
  res.render('list', { title: 'Scraper', start:start, end:end });
  console.log('start:',start,' end:',end);
//3755
  if(start&&end){
   for(var i = start; i <= end; i++){
     scrap.nateParsing('00010011', i, res);
   }
  }
};