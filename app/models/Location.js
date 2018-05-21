const mongoose = require('../../DBConnect');
const Schema = mongoose.Schema;

/**
 * Схема модели адреса.
 */
const LocationScheme = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

LocationScheme.set("toJSON", {
    transform: function (dec, ret, options) {
        delete ret.deleted;
        return ret;
    }
});

/**
 * Загрузка всех адресов для указанного пользователя.
 */
LocationScheme.statics.findByUser = function(userId) {
    return Location.find({userId: userId, deleted: false});
};

/**
 * Обновление адреса.
 */
LocationScheme.statics.updateByWhere = function(where, data) {
    return Location.update({deleted: false, ...where}, data);
};

/**
 * Удаление адреса.
 */
LocationScheme.statics.softDelete = function(cond) {
    return Location.update({deleted: false, ...cond}, {deleted: true}, {multi: true});
};

/**
 * Модель адреса.
 * @type {Model}
 */
const Location = mongoose.model("Location", LocationScheme);

module.exports = Location;



