const config = require('./config');
const mongoose = require('mongoose');
const log = require('./app/utils/Logger');
mongoose.Promise = global.Promise;

/**
 * Установка соединения с БД.
 */
mongoose.connect(config.database.url).then(() => {
    log.info("Connection to MongoDB");
}).catch((err) => {
    log.error(err.message);
});

module.exports = mongoose;
