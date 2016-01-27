'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _gulpUtil = require('gulp-util');

var _mkdirp = require('mkdirp');

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _through2 = require('through2');

var through = _interopRequireWildcard(_through2);

module.exports = function (destinationDirectoryName) {
	if (!destinationDirectoryName) throw new _gulpUtil.PluginError('gulp-put', 'Missing destination directory name!');

	var copyFile = function copyFile(file, enc, cb) {
		var relativePath = path.relative(process.cwd(), file.path);
		var destPath = path.join(destinationDirectoryName, relativePath);

		// console.log('mkdir -p', path.dirname(destPath))
		(0, _mkdirp.mkdirp)(path.dirname(destPath), function (err) {
			if (err) {
				console.error(err);
				return cb(err, file);
			}

			// console.log('copying', file.path, 'to', destPath)
			fs.createReadStream(file.path).pipe(fs.createWriteStream(destPath)).on('finish', function (err) {
				return cb(err, file);
			});
		});
	};

	return through.obj(copyFile);
};