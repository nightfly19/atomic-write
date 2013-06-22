var path = require('path'),
fs = require('fs'),
md5 = require('md5'),
_ = require('underscore');

Context = module.exports.Context = function(){
};

Context.prototype.tempDirectory = function(filePath, cb){
  cb(null, path.dirname(filePath));
};

Context.prototype.tempFileName = function(filePath, cb){
  var prefix = String(Date.now()) + filePath;
  var hashedPrefix = md5.digest_s(prefix);
  var name = "." + hashedPrefix + "." + path.basename(filePath);
  cb(null, path.basename(name));
};

Context.prototype.tempFilePath = function(filePath, cb){
  var manager = this;
  manager.tempDirectory(filePath, function(err, dirPath){
    if(err){
      cb(err);
    }
    else{
      manager.tempFileName(filePath, function(err, filePath){
        if(err){
          cb(err);
        }
        else{
          var tempPath = path.join(dirPath, filePath);
          fs.exists(tempPath,function(exists){
            if(exists){
              manager.tempFilePath(filepath, cb);
            }
            else{
              cb(null, tempPath);
            }
          });
        }
      });
    }
  });
};

Context.prototype.writeFile = function(filename, data, options, callback){
  if(arguments.length < 4){
    callback = options;
    options = {};
  }
  var manager = this;
  manager.tempFilePath(filename, function(err, tempPath){
    fs.writeFile(tempPath, data, options, function(err){
      fs.rename(tempPath, filename, function(err){
        callback(err);
      });
    });
  });
};
