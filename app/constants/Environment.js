/**
 * Константы рабочего окружения.
 */

/**
 * Приложение запущено в production режиме.
 * @type {boolean}
 */
const PRODACTION_MODE = process.env.NODE_ENV === 'production';

/**
 * Приложение запущено в develop режиме.
 * @type {boolean}
 */
const DEVELOP_MODE = !PRODACTION_MODE;

module.exports = {PRODACTION_MODE, DEVELOP_MODE};