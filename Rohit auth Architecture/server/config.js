// console.log('config');

var auth = require('./routes/auth');

module.exports = function (app) {


    auth(app);


    return app;
};