var exec = require('child_process').exec,
    pidof = require('pidof'),
    wmic = require('ms-wmic'),
    ms_wmic_not_found_error = 'No Instance(s) Available.';

function get_pid_on_windows(process_name, cb) {
    if(!process_name) {
        return cb('process_name is required.');
    }

    wmic.process.get({
        where: {
            name: {
                operator: 'LIKE',
                value: '%' + process_name + '%'
            }
        },
        get: ['processId']
    }, function(err, processes, stdOut) {
        if(err) {
            // To maintain consistency with pidof, we ignore 'not found' errors
            if(err.message !== ms_wmic_not_found_error) {
                return cb(err);
            }
        }

        cb(null, extract_pids(processes));
    });
}

function extract_pids(processes) {
    var pids = processes.map(function(process) {
        // ParseInt every line
        return parseInt(process && process.ProcessId);
    }).filter(function(pid) {
        // Put all non-NaNs into an array,
        return pid && !isNaN(pid);
    });

    // Return first item only if length <= 1 (we return undefined if no items left in array)
    return (pids.length <= 1) ? pids[0] : pids;
}

module.exports = /^win/.test(process.platform) ? get_pid_on_windows : pidof;
