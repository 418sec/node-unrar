'use strict';

var childProcess = require('child_process');
var shellEscape = require('shell-escape');
var exec = childProcess.exec;

var UnrarModule = function (options) {
  this.filePath = options.path || options;
};

UnrarModule.prototype.extract = function (dstPath, options, cb) {
  dstPath = escape(dstPath);

  this.execute(['e'], dstPath, function (err, data) {
    if (err) {
      return cb(new Error(err));
    }

    cb(null, data);
  });
};

UnrarModule.prototype.execute = function (args, dstPath, cb) {
  var execCommand = 'unrar ' + args.join() + ' ' + escape(this.filePath);

  if(dstPath) {
    execCommand += ' ' + dstPath;
  }

  exec(execCommand, function (err, stdout) {
    if (err) {
      cb(new Error(err));
    }
    if (stdout.length > 0 && stdout.match(/.*not RAR archive.*/g)) {
      return cb(new Error('Unsupported RAR.'));
    }

    cb(null, stdout);
  });
};

function escape(input) {
  return shellEscape([input]);
}

module.exports = UnrarModule;
