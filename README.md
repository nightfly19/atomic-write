# Atomic Write

Provides an atomic implementation of writeFile.

## Caveats

This is only garenteeed to be atomic on local filesystems. And only when the temporary directory is on the same filesystem as the actual file to be written. And possibly only on some kernels.

## API

* *WriteFile*
Provides atomic file writes/replacement by first writing to a temporary file and renaming to the final destination. 

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
