const LocationRoute = require('express').Router();
const mongoose = require('../../DBConnect');
const checkSession = require('../middlewares/CheckSession');
const Location = require('../models/Location');
const Service = require('../models/Service');
const Payment = require('../models/Payment');
const HttpError = require('../errors/HttpError');

LocationRoute.use(checkSession);

/**
 * Загрузка списка адресов.
 */
LocationRoute.get('/', (req, res, next) => {
    let userId = req.session.user;

    Location.findByUser(userId).then((list) => {
        res.json(list);
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

/**
 * Добавление нового адреса.
 */
LocationRoute.post('/add', (req, res, next) => {
    const data = {
        userId: new mongoose.Types.ObjectId(req.session.user),
        title: req.body.title,
        description: req.body.description
    };

    Location.create(data).then((newData) => {
        res.json(newData);
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

/**
 * Обновление данных адреса.
 */
LocationRoute.post('/save', (req, res, next) => {
    const locationId = req.body._id;

    const data = {
        title: req.body.title,
        description: req.body.description
    };

    Location.updateByWhere({_id: locationId}, data).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

/**
 * Удаление адреса, его услуг, и платежей по услугам.
 */
LocationRoute.post('/delete', (req, res, next) => {
    const locationId = req.body._id;

    Location.softDelete({_id: req.body._id}).then(({ ok }) => {
        if (Boolean(ok)) {
            return Service.findByWhere({locationId: new mongoose.Types.ObjectId(locationId)});
        } else {
            throw new Error(`Ошибка удаления адреса с id=${locationId}`);
        }
    })
    .then((services) => {
        const servicesId = services.map(service => service._id);

        Service.softDelete({_id: servicesId}).then(({ ok }) => {
            const serviceObjIdList = servicesId.map(id => new mongoose.Types.ObjectId(id)); 
            
            if (Boolean(ok)) {
                return Payment.softDelete({service: serviceObjIdList});
            } else {
                throw new Error(`Ошибка удаления услуг: ${serviceObjIdList.join(',')}`);
            }
        });
    })
    .then(() => {
        res.json(true);
    })
    .catch((err) => {
        next(new HttpError(err.message));
    });
});

module.exports = LocationRoute;