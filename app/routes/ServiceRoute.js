const ServiceRoute = require('express').Router();
const mongoose = require('../../DBConnect');
const checkSession = require('../middlewares/CheckSession');
const Service = require('../models/Service');
const Payment = require('../models/Payment');
const HttpError = require('../errors/HttpError');

ServiceRoute.use(checkSession);

/**
 * Получение списка услуг текущего пользователя.
 */
ServiceRoute.get('/', (req, res, next) => {
    let user = req.session.user;

    Service.findByUser(user).then((list) => {
        res.json(list);
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

/**
 * Создание/обновление услуги.
 */
ServiceRoute.post('/save', (req, res, next) => {
    let where = null;

    const data = {
        locationId: new mongoose.Types.ObjectId(req.body.locationId),
        title: req.body.title,
        clientAccount: req.body.clientAccount,
        typePayment: req.body.typePayment,
        userCharge: req.body.userCharge,
        measureUnit: req.body.measureUnit,
        rate: req.body.rate
    };

    if (req.body._id) {
        where = {_id: req.body._id};
    } else {
        data.userId = new mongoose.Types.ObjectId(req.session.user);
    }

    Service.saveByWhere(where, data).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

/**
 * Удаление услуги и её платежей.
 */
ServiceRoute.post('/delete', (req, res, next) => {
    const serviceId = req.body._id;

    Service.softDelete({_id: serviceId})
            .then(({ ok }) => {
                if (Boolean(ok)) {
                    return Payment.softDelete({service: new mongoose.Types.ObjectId(serviceId)});
                } else {
                    throw new Error(`Ошибка удаления услуги с id='${serviceId}'`);
                }
            })
            .then(() => {
                res.json(true);
            })
            .catch((err) => {
                next(new HttpError(err.message));
            });
});

module.exports = ServiceRoute;