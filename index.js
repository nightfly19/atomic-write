var path = require('path'),
fs = require('fs'),
crypto = require('crypto');

function md5(data) {
  var sum = crypto.createHash('md5');
  sum.update(data);
  return sum.digest('hex');
}

Context = function(retry){
    this.retry = retry || 50;
};

Context.prototype.tempDirectory = function(filePath, cb){
  return cb(null, path.dirname(filePath));
};

Context.prototype.tempFileName = function(filePath, cb){
  var prefix = String(Date.now()) + filePath;
  var hashedPrefix = md5(prefix);
  var name = "." + hashedPrefix + "." + path.basename(filePath);
  return cb(null, path.basename(name));
};

Context.prototype.tempFilePath = function(filePath, cb, i){
  i = i || 0;
  var manager = this;
  manager.tempDirectory(filePath, function(err, dirPath){
    if(err){
      return cb(err);
    }
    manager.tempFileName(filePath, function(err, filePath){
      if(err){
        return cb(err);
      }
      var tempPath = path.join(dirPath, filePath);
      fs.exists(tempPath,function(exists){
        if(exists){
          if (i == manager.retry){
            return cb("retry limit " + manager.retry + " reached");
          }
          manager.tempFilePath(filepath, cb, i++);
        }
        return cb(null, tempPath);
      });
    });
  });
};

Context.prototype.writeFile = function(filename, data, options, callback){
  if(arguments.length < 4){
    callback = options;
    options = {};
  }
  var manager = this;
  manager.tempFilePath(filename, function(err, tempPath){
    if(err){
      return callback(err);
    }
    fs.writeFile(tempPath, data, options, function(err){
      if(err){
        return callback(err);
      }
      return fs.rename(tempPath, filename, function(err){
        return callback(err);
      });
    });
  });
};

Context.prototype.Context = Context;

module.exports = new Context();
