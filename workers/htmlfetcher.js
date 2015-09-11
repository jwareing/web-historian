// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require("http");
var archive = require('../helpers/archive-helpers');
var fs = require('fs');

archive.readListOfUrls(function(array) {
  archive.downloadUrls(array, function() {
    console.log("All websites archived!");
  });
});