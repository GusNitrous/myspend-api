const UserRoute = require('express').Router();
const checkSession = require('../middlewares/CheckSession');
const User = require('../models/User');
const HttpError = require('../errors/HttpError');

/**
 * Загрузка данных пользователя с указанным id.
 */
UserRoute.get('/:id', checkSession, (req, res, next) => {
    let userId = req.params.id;

    if (userId) {
        User.findById(userId).then((user) => {
            res.json(user);
        }).catch((err) => {
            next(new HttpError(err.message));
        });
    } else {
        next(new HttpError("Bad request", 400));
    }
});

/**
 * Проверка существования пользователя с указанным email.
 */
UserRoute.post('/checkEmail', (req, res, next) => {
    let email = req.body.email;

    User.findOne({email: email}).then((result) => {
        res.json(Boolean(result));
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

/**
 * Обновление данных пользователя.
 */
UserRoute.post('/save', checkSession, (req, res, next) => {
    let userId = req.body._id;

    let data = {
        email: req.body.email,
        name: req.body.name,
        lastName: req.body.lastName
    };

    User.update({_id: userId}, data).then((result) => {
        res.json(!!result.ok);
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

/**
 * Обновление пароля пользователя.
 */
UserRoute.post('/updatePassword', checkSession, (req, res, next) => {
    let userId = req.body.id;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    User.findById({_id: userId}).then((user) => {
        if (user && user.checkPassword(oldPassword)) {
            user.password = newPassword;
            
            user.save().then((newUser) => {
                res.json(!!newUser);
            }).catch((err) => {
                throw new Error(err.message);
            });
        } else {
            throw new Error('Ошибка изменения пароля пользователя');
        }
    }).catch((err) => {
        next(new HttpError(err.message));
    });
});

module.exports = UserRoute;