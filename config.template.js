/**
 * Шаблон конфигурации приложения.
 */
module.exports = {
    port: 8000,
    database: {
        url: 'mongodb://localhost:27017/my_spend'
    },
    cors: {
        origin: ''
    },
    secretSessionKey: ''
};