const AuthRoute = require('express').Router();
const User = require('../models/User');
const authGuard = require('../middlewares/AuthGuard');
const HttpError = require('../errors/HttpError');

/**
 * Авторизация.
 */
AuthRoute.post('/signin', (req, res, next) => {
    if (req.session.user) {
        User.findById(req.session.user).then((authUser) => {
            res.json(authUser);
        }).catch((err) => {
            next(err);
        });
    } else {
        let email = req.body.email;
        let password = req.body.password;

        User.login(email, password).then((user) => {
            req.session.user = user._id;
            res.json(user);
        }).catch((err) => {
            next(new HttpError(err.message));
        });
    }
});

/**
 * Регистрация.
 */
AuthRoute.post('/signup', authGuard, (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({email: email}).then((user) => {
        if (user) {
            next(new HttpError(`User email ${email} already exists`, 403));
        } else {
            User.create({
                email: email,
                password: password
            }).then((newUser) => {
                res.send(true);
            }).catch((err) => {
                next(new HttpError(`Error register user`));
            });
        }
    });
});

/**
 * Завершение сеанса.
 */
AuthRoute.post('/signout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            next(new HttpError(err.message));
        } else {
            res.send(true);
        }
    });
});

module.exports = AuthRoute;