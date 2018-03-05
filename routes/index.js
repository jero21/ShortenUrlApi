var express = require('express');
var router = express.Router();
var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Endpoints
router.get('/:id', db.getLongUrlFromShortUrl);
router.get('/api/url/expand', db.expandShortUrlToLongUrl);
router.post('/api/url/create', db.createShortUrl);

module.exports = router;
