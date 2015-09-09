var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  if (req.url === '/'){
    fs.readFile(archive.paths.index, function (err, data) {
      if (err) {
        throw err;
      }
      res.writeHeader(200, {"Content-Type": "text/html"});
      res.end(data);
    });
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
    res.writeHeader(404)
    res.end('404, file not found');
  }
};
