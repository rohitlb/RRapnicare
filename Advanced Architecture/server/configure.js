var authRoute = require('./routes/auth');

module.exports = function (app) {
    authRoute(app);

    return app;
};