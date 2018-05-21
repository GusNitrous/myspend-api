const mongoose = require('../../DBConnect');
const Schema = mongoose.Schema;
const Payment = require('./Payment');

/**
 * Схема модели услуги.
 */
const ServiceScheme = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    locationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Location'
    },
    title: {
        type: String,
        required: true
    },
    clientAccount: {
        type: String,
        required: true
    },
    typePayment: {
        type: String,
        required: true,
    },
    userCharge: {
        type: Number,
        default: 0,
    },
    measureUnit: {
        type: String,
        default: '',
    },
    rate: {
        type: Number,
        default: 0,
    },
    bankExists: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

ServiceScheme.set("toJSON", {
    transform: function (dec, ret, options) {
        delete ret.deleted;
        return ret;
    }
});

/**
 * Загрузка всех услуг для указанного пользователя.
 */
ServiceScheme.statics.findByUser = function(userId) {
    return Service.find({userId: userId, deleted: false});
};

/**
 * Загрузка списка услуг.
 */
ServiceScheme.statics.findByWhere = function(where) {
    return Service.find({deleted: false, ...where});
};

/**
 * Создание/обновление услуги.
 */
ServiceScheme.statics.saveByWhere = function(where, data) {
    return where ? Service.update({deleted: false, ...where}, data) : Service.create(data);
};

/**
 * Удаление услуги.
 */
ServiceScheme.statics.softDelete = function(cond) {
    return Service.update({deleted: false, ...cond}, {deleted: true}, {multi: true});
};

/**
 * Модель услуги.
 * @type {Model}
 */
const Service = mongoose.model("Service", ServiceScheme);

module.exports = Service;



