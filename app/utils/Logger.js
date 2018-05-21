const path = require('path');
const fs = require('fs');
const bunyan = require('bunyan');

const dirLog = path.join(__dirname, '..', '..', 'logs');

const options = {
    name: 'MySpend',
    time: (new Date).toLocaleString(),
    streams: [{
        type: 'rotating-file',
        path: path.join(dirLog, 'app-info.log'),
    },
    {
        type: 'file',
        path: path.join(dirLog, 'app-error.log'),
        level: 'error'
    }]
};

if (!fs.existsSync(dirLog)) {
    fs.mkdirSync(dirLog);
}

const logger = bunyan.createLogger(options);

module.exports = logger;