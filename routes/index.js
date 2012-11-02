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

exports.getList = function(req, res){
  scrap.getList('00010011&s', 1, res);
  res.render('index', { title: 'GetPeople List' });
};

	
