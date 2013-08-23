# Atomic Write

Provides atomic implementation of fs.writeFile by first writing to a temporary file and renaming to the final destination. 

## Caveats

This is only garenteeed to be atomic on local filesystems. And only when the temporary directory is on the same filesystem as the actual file to be written. And possibly only on some kernels.

## Quickstart

```javascript
var aWrite = require('atomic-write');

//writeFile has the same interface as fs.writeFile
aWrite.writeFile('/tmp/file', 'example data', function(err, result){
  if(err){
    return console.log(err);
  }
  
  console.log("File written");
}
```

## Module API

* *writeFile(filename, data, options, callback)*
Atomically write a file.

* *Context()*
Constructor that creates a new atomic-write context where you can change the implementation of atomic-write's internal functions can be changed without effecting the global atomic-write context.

## Internal functions

These functions can be re-implemented in new Contexts if atomic-writes defaults don't suite your task.

* *tempDirectory(filePath, cb)*
Yields the directory in which the temporary file will be created.
By default this is the same directory as where the final file will be created.
Calls the callback with an error if one occured, and the directory.

* *tempFilename(filePath, cb)*
Yields the basename of the temporary file that will be created.
By default this is a unix style hidden file with an md5 sum of the the pathname and current time in milliseconds along with the real basename of the file.
Calls the callback with an error if one occured, and the basename.

* *tempFilepath(filePath, cb)*
Yields the path to the temporary file that will be created.
By default this is join of the result of tempDirectory and tempFilename.

*warning*
In the default implemenation if tempFilename already exists
tempFilePath will be called recursively with the same arguments 
until a unique filename is found.
If your implemenation of tempFilename is purely functional your gonna have a bad time.

