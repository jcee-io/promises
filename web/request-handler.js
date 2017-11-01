var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var http = require('http');

exports.handleRequest = function (req, res) {
  // console.log(req.url)
  var statusCode = 200;
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(statusCode, httpHelpers.headers);
    httpHelpers.getIndex((data) => {
      res.end(data);
    });
  } else if (req.method === 'GET') {
    fs.readdir(archive.paths.archivedSites, (err, files) => {
      // console.log(files)
      if (err) {
        throw error;
      }
      if (!files.includes(req.url.slice(1))) {
        statusCode = 404;
        res.writeHead(statusCode, httpHelpers.headers);
        res.end(null);
      } else {
        fs.readFile(archive.paths.archivedSites + req.url, (err, data) => {
          res.writeHead(statusCode, httpHelpers.headers);
          res.end(data);
        });
      }
    });

  }
  if (req.method === 'POST') {
    statusCode = 201;
    // if (archive.isUrlArchived(req.url.slice(1), () => {
    //   http.get()
    // })) {
      
    
    var body = '';
    req.on('data', chunk => {
      // console.log(chunk)
      body += chunk.toString();
    }).on('end', () => {
      archive.addUrlToList(body.slice(4), () => {
        statusCode = 302;
        res.writeHead(statusCode, httpHelpers.headers);
        res.end('');
      });
    });
  } 
};
