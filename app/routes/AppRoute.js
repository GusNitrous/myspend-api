const AppRoute = require('express').Router();
const mongoose = require('../../DBConnect');
const checkSession = require('../middlewares/CheckSession');
const Location = require('../models/Location');
const Service = require('../models/Service');
const Payment = require('../models/Payment');
const HttpError = require('../errors/HttpError');
const moment = require('moment');

/**
 * Application routes.
 */

AppRoute.get('/ping', (req, res) => {
    res.json("MySpend application server");
});

module.exports = AppRoute;

