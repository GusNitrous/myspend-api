const mongoose = require('../../DBConnect');
const Schema = mongoose.Schema;
const moment = require('moment');

/**
 * Схема модели платежа.
 */
const PaymentScheme = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    service: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Service'
    },
    typePayment: {
        type: String,
        required: true
    },
    paymentDay: {
        type: Number,
        required: true
    },
    paymentSum: {
        type: Number,
        required: true
    },
    period: {
        type: String,
        required: true
    },
    lastMeterReading: {
        type: String,
        default: '',
    },
    meterReading: {
        type: String,
        default: '',
    },
    spending: {
        type: Number,
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

PaymentScheme.set("toJSON", {
    transform: function (dec, ret, options) {
        delete ret.deleted;
        return ret;
    }
});

/**
 * Загрузка списка платежей по условию.
 */
PaymentScheme.statics.findByWhere = function(where) {
    return Payment.find({deleted: false, ...where});
};

/**
 * Удаление платежа по условию.
 */
PaymentScheme.statics.softDelete = function(cond) {
    return Payment.update({deleted: false, ...cond}, {deleted: true}, {multi: true});
}

/**
 * Получает общую статистику по платежам за указанный период.
 */
PaymentScheme.statics.getCommonStat = function(userId, dateFrom, dateTo) {
    return Payment.aggregate([
        { $match: {
            deleted: false,
            paymentDay: {$gte: dateFrom, $lt: dateTo},
            user: userId
        }},
        { $group: {
            _id: "$service",
            total: {$sum: "$paymentSum"},
            spendingSum: {$sum: "$spending"},
            serviceId: {$first: "$service"}
        } },
        { $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "services"
        } },
        { $project : { 
                "_id" : 0,
                "serviceId" : 1,
                "total" : 1,
                "spendingSum" : 1,
                "services._id" : 1,
                "services.title" : 1,
                "services.typePayment" : 1,
                "services.measureUnit": 1
        } }
    ]);
}

/**
 * Получает общую сумму платежей за указанный период.
 */
PaymentScheme.statics.getTotalSum = function(userId, dateFrom, dateTo) {
    return Payment.aggregate([
        { $match: {
            deleted: false,
            paymentDay: {$gte: dateFrom, $lt: dateTo},
            user: userId
        }},
        { $group: {
            _id: null,
            total: {$sum: "$paymentSum"}
        } },
        { $project : { 
            "_id" : 0,
        } }
    ]);
}

/**
 * Модель платежа.
 */
const Payment = mongoose.model("Payment", PaymentScheme);

module.exports = Payment;



