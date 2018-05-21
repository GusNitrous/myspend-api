const HttpError = require('../errors/HttpError');

/**
 * Middleware для проверки наличия пройденной аутентификации.
 */
function authGuard(req, res, next) {
    if (req.session.user) {
        next(new HttpError('Forbidden', 403));
    } else {
        next();
    }
}

module.exports = authGuard;