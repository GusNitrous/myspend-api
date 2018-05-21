const StatsRoute = require('express').Router();
const mongoose = require('../../DBConnect');
const checkSession = require('../middlewares/CheckSession');
const Payment = require('../models/Payment');
const HttpError = require('../errors/HttpError');
const { getUnixTime } = require('../utils/TimeUtil');
const moment = require('moment');

StatsRoute.use(checkSession);

/**
 * Получение общих данных статистики за последний месяц.
 */
StatsRoute.post('/last', (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.session.user); 
    const {from, to} = req.body;

    const dateFrom = from ? Number(from) : getUnixTime(moment().subtract(1, 'month'));
    const dateTo = to ? Number(to) : getUnixTime(moment());

    const promiseList = [
        Payment.getCommonStat(userId, dateFrom, dateTo),
        Payment.getTotalSum(userId, dateFrom, dateTo)
    ];

    Promise.all(promiseList).then((result) => {
        const [common, total] = result;
        res.json({
            byServices: common, 
            totalSum: total[0] ? Number(total[0].total) : 0
        });
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

module.exports = StatsRoute;