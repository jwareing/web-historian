var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var qs = require('querystring');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

//'floodgates.com:8080/www.google.com'
  if (req.url === '/'){
    if (req.method === 'POST'){
      var rawData = "";
      var post;
      req.on('data', function (chunk) {
        rawData += chunk;
      });
      req.on('end', function () {
        post = qs.parse(rawData);
        archive.downloadUrls([post.url], function() {
          res.writeHeader(302);
          res.end();
        });
        
        /*
        setTimeout(function() {
          res.writeHeader(302);
          res.end();
        }, 1500 );
        */
      });
    }
    else {
      fs.readFile(archive.paths.index, function (err, data) {
        if (err) {
          throw err;
        }
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.end(data);
      });
    }
  }
  else if (req.url === '/favicon.ico'){
    fs.readFile(archive.paths.favicon, function (err, data) {
      if (err) {
        throw err;
      }
      res.writeHeader(200);
      res.end(data);
    });
  }
  else {
    archive.isUrlInList(req.url.slice(1), function(is){
      console.log(req.url.slice(1));
      if (is){
        fs.readFile(archive.paths.archivedSites + '/' +req.url.slice(1), function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHeader(200, {"Content-Type": "text/html"});
          res.end(data);
        });
      }
      else {
        res.writeHeader(404);
        res.end('404, file not found');
      }
    }); // Check for file in the sites.txt and the sites directory
  }
};
