var fs = require('fs');
var path = require('path');
var http = require("http");
var http = require('follow-redirects').http;
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html'),
  favicon: path.join(__dirname, '../web/public/favicon.ico')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(exports.paths.list, 'utf-8', function (err, data) {
    if (err){
      throw err;
    }
    var array = data.toString().split("\n");

    if (array[array.length-1] === "") {
      array = array.slice(0, array.length-1);
    }

    cb(array);
  });
};

exports.isUrlInList = function(wantedURL, cb) {
  exports.readListOfUrls(function(data){
    cb(data.indexOf(wantedURL)===-1 ? false : true);
  });
};

exports.addUrlToList = function(url, cb) {
  fs.appendFile(exports.paths.list, url + "\n", 'utf-8', function (err) {
    if (err) throw err;
    cb();
  });
};

exports.isUrlArchived = function(url, cb) {
  fs.stat(exports.paths.archivedSites + '/' + url, function(err, stats) {
    if (err) cb(false);
    else{
      cb(stats.isFile());
    }
  });
};

exports.downloadUrls = function(urls, cb) {
  var i = 0;
  var total = urls.length;
  _.each(urls, function(url) {
    exports.isUrlInList(url, function(is){
      if (!is){
        exports.addUrlToList(url, function() {
          download(url);
          if (++i === total) {
            typeof cb === 'function' && cb();
          }
        });
      }
      else {
        exports.isUrlArchived(url, function(is){
          if (!is) {
            download(url);
            if (++i === total) {
              typeof cb === 'function' && cb();
            }
          } else {
            if (++i === total) {
              typeof cb === 'function' && cb();
            }
          }
        });
      }
    });
  });
  var download = function(url){
    var request = http.request({host: url, port: 80}, function (res) {
      var data = '';
      res.on('data', function (chunk) {
          data += chunk;
      });
      res.on('end', function () {
        console.log(exports.paths.archivedSites + '/' + url);
        fs.writeFile(exports.paths.archivedSites + '/' + url, data, function (err) {
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
};
