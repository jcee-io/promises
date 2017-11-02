// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var CronJob = require('cron').CronJob;
var fs = require('fs');

var job = new CronJob('* * * * * *', function() {
  archive.readListOfUrls(data => {
    archive.downloadUrls(data);
  }); 
}, true);

job.start();
