var promise = require('bluebird');
var Hashids = require("hashids");

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:postgres@localhost:5432/shortlink';
var db = pgp(connectionString);

// receives a short url and returns the original url
function expandShortUrlToLongUrl(req, res, next) {
	if(!req.query.shortUrl) {
    return res.status(400).send({"status": "error", "message": "A short URL is required"});
  }
  db.any('SELECT * FROM urls WHERE short_url = $1', [req.query.shortUrl])
    .then(function (data) {
      res.send(data.length > 0 ? data[0] : {});
    })
    .catch(function (err) {
      return next(err);
    });
}

// receive the short url and open the original url in the browser
function getLongUrlFromShortUrl(req, res, next) {
	if(!req.params.id) {
    return res.status(400).send({"status": "error", "message": "An id is required"});
  }
  db.one('SELECT * FROM urls WHERE id = $1', [req.params.id])
    .then(function (data) {
      res.redirect(data.long_url);
    })
    .catch(function (err) {
      return next(err);
    });
}

  // it is receive an url, it is saved in the database, the short url is created with the help of Hashids, 
 // then a new short url is returned
function createShortUrl(req, res, next) {
	if(!req.body.longUrl) {
      return res.status(400).send({"status": "error", "message": "A long URL is required"});
  }
  db.any('SELECT * FROM urls WHERE long_url = $1', [req.body.longUrl])
  .then(function (data) {
    if(data.length === 0) {
    	var hashids 	= new Hashids();
    	var response = {
	      id: hashids.encode((new Date).getTime()),
	      longUrl: req.body.longUrl
    	}
    	response.shortUrl = "http://localhost:3000/" + response.id;
     	
      db.none('INSERT INTO urls(id, short_url, long_url) VALUES(${id}, ${shortUrl}, ${longUrl})', response)
      .then(function () {
	      res.status(200)
	        .json({
	          status: 'success',
            data: response,
	          message: 'Inserted one url'
	        });
	    })
	    .catch(function (err) {
	      return next(err);
	    });
		} else {
			res.send(data[0]);
		}
	})
	.catch(function (err) {
    return next(err);
  });
}

module.exports = {
  getLongUrlFromShortUrl: getLongUrlFromShortUrl,
  createShortUrl: createShortUrl,
  expandShortUrlToLongUrl: expandShortUrlToLongUrl
};
