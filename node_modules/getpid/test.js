var assert = require('assert'),
    getpid = require('./');

getpid('node', function(err, pid) {
    assert.ifError(err);

    assert(pid, 'Failed to find pid of node.');

    if(Array.isArray(pid)) {
        assert(pid.indexOf(process.pid) >= 0, 'Failed to find this process in list.');
    } else {
        assert(pid === process.pid, 'Failed to find the pid of this process.');
    }

    console.log('PID for this process found OK!');
});
