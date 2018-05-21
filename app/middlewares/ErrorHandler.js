const log = require('../utils/Logger');

/**
 * Middleware обработки ошибок.
 */
function errorHandler(err, req, res, next) {
    log.error(err.toString());

    if (res.headersSent) {
        return next(err);
    }

    res.status(200);
    res.json({error: err.message, code: err.code});
}

module.exports = errorHandler;