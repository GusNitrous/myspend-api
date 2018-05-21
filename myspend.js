const {PRODACTION_MODE} = require('./app/constants/Environment');
const mongoose = require('./DBConnect');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressMongoStore = require('express-mongoose-store')(session, mongoose);
const MongoStore = new expressMongoStore({cache_ttl: 1});
const app = require('express')();
const log = require('./app/utils/Logger');
const cors = require('cors');

const errorHandler = require('./app/middlewares/ErrorHandler');

const config = require('./config');

const routes = require('./app/routes');

const corsOptions = {
    origin: PRODACTION_MODE ? config.cors.origin : 'http://localhost:3000',
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: config.secretSessionKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore,
    unset: 'destroy'
}));

routes.forEach((rt) => {
    app.use(rt.route, rt.handler);
});

app.use(errorHandler);

app.listen(config.port, () => {
    log.info("App start");
});



