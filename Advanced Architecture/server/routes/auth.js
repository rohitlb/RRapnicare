var express = require('express'),
    router = express.Router(),
    auth = require('../../controllers/auth');

module.exports = function (app) {
    router.post('/signup',auth.otp);
    router.post('/signup/register',auth.registerUser);
    app.use(router);
};