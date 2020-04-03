'use strict';

var childProcess = require('child_process');
var execFile = childProcess.execFile;

var UnrarModule = function (options) {
  this.filePath = options.path || options;
};

UnrarModule.prototype.extract = function (dstPath, options, cb) {
  this.execute(['e'], dstPath, function (err, data) {
    if (err) {
      return cb(new Error(err));
    }

    cb(null, data);
  });
};

UnrarModule.prototype.execute = function (args, dstPath, cb) {
  var execCommand = args.concat([this.filePath]);

  if(dstPath) {
    execCommand.push(dstPath);
  }

  execFile('unrar', execCommand, function (err, stdout) {
    if (err) {
      cb(new Error(err));
    }
    if (stdout.length > 0 && stdout.match(/.*not RAR archive.*/g)) {
      return cb(new Error('Unsupported RAR.'));
    }

    cb(null, stdout);
  });
};


module.exports = UnrarModule;
