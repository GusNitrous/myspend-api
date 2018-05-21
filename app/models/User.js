const crypto = require('crypto');
const mongoose = require('../../DBConnect');
const Schema = mongoose.Schema;

/**
 * Схема модели пользователя.
 */
const UserScheme = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastVisit: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

UserScheme.set("toJSON", {
    transform: function (dec, ret, options) {
        delete ret.hash;
        delete ret.salt;
        return ret;
    }
});

/**
 * Виртуальное свойство "password".
 */
UserScheme.virtual('password')
    .get(function() {
        return this.hash;
    })
    .set(function(password) {
        this.salt = Math.random() + '';
        this.hash = this.encryptPassword(password);
    });

/**
 * Создаёт хеш для переданного пароля.
 * @param password
 * @returns {string}
 */
UserScheme.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

/**
 * Проверяет переданный пароль.
 * @param password
 * @returns {boolean}
 */
UserScheme.methods.checkPassword = function(password) {
   return this.encryptPassword(password) === this.hash;
};

/**
 * Аутентификация пользователя.
 * @param email
 * @param password
 * @returns {Promise}
 */
UserScheme.statics.login = function(email, password) {
    return new Promise((resolve, reject) => {
        User.findOne({email: email}).then((user) => {
            if (!user || !user.checkPassword(password)) {
                throw new Error('Неверное имя пользователя или пароль');
            } else {
                user.lastVisit = Date.now();

                user.save().then((updUser) => {
                    resolve(updUser);
                }).catch((err) => {
                    reject(err);
                });
            }
        }).catch((err) => {
            reject(err);
        });
    });
};

/**
 * Модель пользователя.
 * @type {Model}
 */
const User = mongoose.model("User", UserScheme);

module.exports = User;



