## getpid

Cross-platform PID retrieval (by process name), using [pidof](https://github.com/calmh/node-pidof) on OSX/Unix and [ms-wmic](https://github.com/mjhasbach/node-ms-wmic) on Windows.

```sh
npm i getpid --save
```

### Usage
```js
var getpid = require('getpid');

getpid('node', function(err, pid) {
    if(err) {
        return handle_error(err);
    }

    if(Array.isArray(pid)) {
        // Windows only, if the query matches multiple running process names
        // then you'll get an array of matched PIDs back
        pid.forEach(say_hello);
    } else {
        // Even if no errors occurred, pid may still be null/undefined if it wasn't found
        if(pid) {
            say_hello(pid);
        } else {
            handle_error('PID not found');
        }
    }
});
```
