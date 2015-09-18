# gulp-pkgcloud-upload
[![NPM](https://nodei.co/npm/gulp-pkgcloud-upload.png)](https://npmjs.org/package/gulp-pkgcloud-upload)


A [gulp](https://github.com/gulpjs/gulp) plugin for uploading files to a cloud service via pkgcloud. This plugin is based off of [gulp-cloudfiles](https://github.com/pieceoftoast/gulp-cloudfiles) by [pieceoftoast](https://github.com/pieceoftoast).

What sets this gulp plugin apart from gulp-cloudfiles is that it can potentially support any [Storage provider that pkgcloud supports](https://github.com/pkgcloud/pkgcloud#storage) and it will wait until all files have been uploaded before telling gulp to proceed on to the next task.

**At the moment, this library only supports streaming. So set { buffer: false } on the gulp.src call.**

## Installing
```
npm install gulp-pkgcloud-upload --save-dev
```

## Example
```javascript
var gulp = require('gulp');
var pkgcloudUpload = require('gulp-pkgcloud-upload');

// This config object is passed directly to pkgcloud.
// See pkgcloud docs for how it should appear for various Storage providers
var pkgcloudConfig =  {
  provider: 'rackspace', // Other providers should be supported (not tested)
  username: 'yourRackspaceUsername',
  apiKey: 'YOUR KEY',
  region: 'ORD',
  container: 'yourContainerName' // Container for files to go into
};

gulp.task('deploy', function() {
  return gulp
    .src('./mobile/build/**', { buffer: false })
    .pipe(
      pkgcloudUpload(pkgcloudConfig, {
        uploadPath: 'someFolder/mobile', // Where to place files
        headers: { // Optional set of HTTP headers to apply to each file
          'Access-Control-Allow-Origin': '*'
        }
      })
    );
});
```
