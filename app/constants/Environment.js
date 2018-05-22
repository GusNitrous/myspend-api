/**
 * Константы рабочего окружения.
 */

/**
 * Приложение запущено в develop режиме.
 * @type {boolean}
 */
const DEVELOP_MODE = process.env.NODE_ENV === 'develop';

/**
 * Приложение запущено в production режиме.
 * @type {boolean}
 */
const PRODUCTION_MODE = !DEVELOP_MODE;

module.exports = {PRODUCTION_MODE, DEVELOP_MODE};