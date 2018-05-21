const HttpError = require('../errors/HttpError');

/**
 * Middleware для проверки сессии пользователя.
 */
function checkSession(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        next(new HttpError('Unauthorized', 401));
    }
}

module.exports = checkSession;