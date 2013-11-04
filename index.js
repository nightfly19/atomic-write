var path = require('path'),
fs = require('fs'),
crypto = require('crypto');

function md5(data) {
  var sum = crypto.createHash('md5');
  sum.update(data);
  return sum.digest('hex');
}

Context = function(){
};

Context.prototype.tempDirectory = function(filePath, cb){
  try{
    return cb(null, path.dirname(filePath));
  }
  catch(e){
    return cb(e);
  }
};

Context.prototype.tempFileName = function(filePath, cb){
  try{
    var prefix = String(Date.now()) + filePath;
    var hashedPrefix = md5(prefix);
    var name = "." + hashedPrefix + "." + path.basename(filePath);
    return cb(null, path.basename(name));
  }
  catch(e){
    return cb(e);
  }
};

Context.prototype.tempFilePath = function(filePath, cb){
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
          return ;manager.tempFilePath(filepath, cb);
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
