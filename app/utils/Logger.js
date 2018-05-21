const path = require('path');
const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'MySpend',
    time: (new Date).toLocaleString(),
    streams: [{
        type: 'rotating-file',
        path: path.join(__dirname, '..', '..', 'logs', 'app-info.log'),
    },
    {
        type: 'file',
        path: path.join(__dirname, '..', '..', 'logs', 'app-error.log'),
        level: 'error'
    }]
});

module.exports = logger;