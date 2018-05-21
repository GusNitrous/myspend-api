/**
 * Класс для обработки http ошибок.
 */
class HttpError extends Error {
    constructor(message, code = 500) {
        super(message);
        this.name = 'HttpError';
        this.code = code;
    }
}
module.exports = HttpError;