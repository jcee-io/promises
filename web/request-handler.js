var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var http = require('http');

var send = function(res, statusCode, data) {
  res.writeHead(statusCode, httpHelpers.headers);
  res.end(data);
};

exports.handleRequest = function (req, res) {
  var statusCode = 200;
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(statusCode, httpHelpers.headers);
    httpHelpers.getIndex((data) => {
      res.end(data);
    });
  } else if (req.method === 'GET') {
    fs.readdir(archive.paths.archivedSites, (err, files) => {
      if (err) {
        throw error;
      }
      if (!files.includes(req.url.slice(1))) {
        statusCode = 404;
        send(res, statusCode, null);
      } else {
        httpHelpers.readFile(archive.paths.archivedSites + req.url)
          .then(data => send(res, statusCode, data));        
      }
    });

  }
  if (req.method === 'POST') {
    statusCode = 201;
    var body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    }).on('end', () => {
      archive.isUrlArchived(body.slice(4), flag => {
        if (flag) {
          statusCode = 302; 
          httpHelpers.readFile(archive.paths.archivedSites + '/' + body.slice(4))
            .then(data => send(res, statusCode, data.toString()));
        } else {
          archive.addUrlToList(body.slice(4))
            .then(() => httpHelpers.readFile('./public/loading.html'))
            .then(data => send(res, statusCode, data.toString()));
        }
      });
    });
    
         
  } 
};
