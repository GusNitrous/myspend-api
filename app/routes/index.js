const UserRoute = require('./UserRoute');
const AuthRoute = require('./AuthRoute');
const LocationRoute = require('./LocationRoute');
const ServiceRoute = require('./ServiceRoute');
const PaymentRoute = require('./PaymentRoute');
const StatsRoute = require('./StatsRoute');
const AppRoute = require('./AppRoute');

module.exports = [
    {route: '/', handler: AppRoute},
    {route: '/auth', handler: AuthRoute},
    {route: '/user', handler: UserRoute},
    {route: '/locations', handler: LocationRoute},
    {route: '/services', handler: ServiceRoute},
    {route: '/payments', handler: PaymentRoute},
    {route: '/stats', handler: StatsRoute}
];