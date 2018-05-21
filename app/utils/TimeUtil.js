const moment = require('moment');

/**
 * Форматирует переданный объект времени в unix timestamp
 * @param {*} momentObject 
 */
function getUnixTime(momentObject) {
    return momentObject.hours(0).minutes(0).seconds(0).milliseconds(0).unix();
}

module.exports = {getUnixTime: getUnixTime};