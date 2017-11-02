var fs = require('fs');
var path = require('path');
var _ = require('underscore');
const http = require('http');

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
  index: path.join(__dirname, '../web/public/index.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, (err, data) => {
    if (err) {
      throw error;
    }
    callback(data.toString().split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((data) => {
    callback(data.indexOf(url) > -1);
  });
};

exports.addUrlToList = function(url, callback) {
  exports.readListOfUrls((data) => {
    data = data.join('\n');
    data += url + '\n';
    fs.writeFile(exports.paths.list, data, (err) => {
      if (err) {
        throw error;
      } else {
        console.log('URL added');
        exports.downloadUrls([url]);
      }
    });
    callback(url);
    
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, (err, files) => {
    if (err) {
      throw error;
    }
    callback(files.indexOf(url) > -1);
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach((url) => {
    http.get('http://' + url, (res) => {
      let body = '';
      res.on('data', chunk => {
        body += chunk.toString();
      }).on('end', () => {
        fs.writeFile(exports.paths.archivedSites + '/' + url, body, (err) => {
          if (err) {
            throw error;
          }
          console.log(url, 'archived');
        });
      });
    });
  });
};











