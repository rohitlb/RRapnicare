var authRoute = require('./routes/auth');

module.exports = function (api) {
    authRoute(api);

    return api;
}