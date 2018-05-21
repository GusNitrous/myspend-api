const PaymentRoute = require('express').Router();
const mongoose = require('../../DBConnect');
const checkSession = require('../middlewares/CheckSession');
const Payment = require('../models/Payment');
const Service = require('../models/Service');
const HttpError = require('../errors/HttpError');

/**
 * PaymentRoute
 */

PaymentRoute.use(checkSession);

/**
 * Загрузка данных о платежах для активного пользователя.
 */
PaymentRoute.get('/', (req, res, next) => {
    const userId = req.session.user;

    Payment.findByWhere({user: userId})
            .populate({path:'service', select: 'title'})
            .sort({'paymentDay': -1})
            .exec()
            .then((list) => {
                res.json(list);
            }).catch((err) => {
                next(new HttpError(err.message));
            });
});

/**
 * Подготовка данных для оплаты.
 */
PaymentRoute.post('/prepare', (req, res, next) => {
    const serviceId = req.body.serviceId;

    Service.findOne({_id: serviceId, deleted: false})
            .populate({path: 'locationId', select: 'title'})
            .exec()
            .then((service) => {
                return Payment.findOne({service: service._id, deleted: false})
                        .sort({'paymentDay': -1})
                        .then((lastPayment) => Promise.resolve({
                                service: service._id,
                                title: service.title,
                                clientAccount: service.clientAccount,
                                location: service.locationId.title,
                                typePayment: service.typePayment,
                                lastMeterReading: lastPayment ? lastPayment.meterReading : 0,
                                paymentSum: service.userCharge,
                                rate: service.rate,
                                paymentDay: Date.now(),
                                meterReading: 0,
                                period: ''
                            }))
            })
            .then((paymentData) => {
                res.json(paymentData);
            })
            .catch((err) => {
                next(new HttpError(err.message));
            });
});

/**
 * Загрузка данных об оплате для указанной услуги.
 */
PaymentRoute.post('/getByService', (req, res, next) => {
    const serviceId = req.body.serviceId;

    Payment.findByWhere({_serviceId: serviceId})
            .populate({path:'service', select: 'title'})
            .exec()
            .then((result) => {
                res.json(result);
            }).catch((err) => {
                next(new HttpError(err.message));
            });
});

/**
 * Фиксация данных об оплате.
 */
PaymentRoute.post('/add', (req, res, next) => {
    const body = req.body;

    const payment = new Payment({
        user: new mongoose.Types.ObjectId(req.session.user),
        service: new mongoose.Types.ObjectId(body.service),
        typePayment: body.typePayment,
        paymentDay: Number(body.paymentDay),
        paymentSum: body.paymentSum,
        period: body.period,
        lastMeterReading: body.lastMeterReading,
        meterReading: body.meterReading,
        spending: body.spending
    });

    payment.save().then(() => {
        return Payment.populate(
            payment, 
            {path:'service', select: 'title'}
        );
    })
    .then((populatedData) => {
        res.json(populatedData);
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

/**
 * Удаление данных об оплате.
 */
PaymentRoute.post('/delete', (req, res, next) => {
    Payment.softDelete({paymentId: req.body.id}).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

module.exports = PaymentRoute;