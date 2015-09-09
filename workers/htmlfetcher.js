// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require("http");
var archive = require('../helpers/archive-helpers');
var fs = require('fs');

exports.download = function(url){
  var request = http.request({host: url, port: 80}, function (res) {
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {
      console.log(archive.paths.archivedSites + '/' + url);
      fs.writeFile(archive.paths.archivedSites + '/' + url, data, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    });
  });
  request.on('error', function (e) {
      console.log(e.message);
  });
  request.end();
};