'use strict';

var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var pkgcloud = require('pkgcloud');
var streamToQueue = require('stream-to-queue');

var pkgcloudUpload = function (pkgcloudConfig, options) {
  var options = options || {};
  var client = pkgcloud.storage.createClient(pkgcloudConfig);

  return streamToQueue(function (file, cb) {

    var uploadPath = file.path.replace(file.base, '').replace(/\\/g,'/');
    uploadPath = path.join(options.uploadPath, uploadPath).replace(/\\/g,'/');

    var headers = { 'x-amz-acl': 'public-read' };
    if (options.headers) {
      for (var key in options.headers) {
        headers[key] = options.headers[key];
      }
    }

    var isFile = fs.lstatSync(file.path).isFile();
    if (!isFile) {
      cb(null, file);
    }
    else if (file.isStream()) {
      var writeStream = client.upload({
        container: pkgcloudConfig.container,
        remote: uploadPath,
        headers: headers
      });
      writeStream.on('error', function(err) {
        gutil.log(gutil.colors.red('[FAILED]', err, file.path));
        cb(null, file);
      });

      writeStream.on('success', function(f) {
        gutil.log(gutil.colors.green('[SUCCESS]', file.path));
        cb(null, file);
      });

      file.contents.pipe(writeStream);
    }
    else if (file.isBuffer()) {
      cb(new Error('Buffers are not supported'));
    }
    else {
      console.log(file.path);
      cb(null, file);
    }
  }, 5);

};

module.exports = pkgcloudUpload;
