var express = require('express'),
    router = express.Router(),
    auth = require('../../../controllers/api/auth.js');

module.exports = function (api) {
    //done
    router.post('/signup',auth.otp);
    //done
    router.post('/signup/register',auth.registerUser);
    //done
    router.post('/login',auth.login);
    //done
    router.post('/login/forgot',auth.forgotPassword);
    //done
    router.post('/login/forgot/verify',auth.verifyForgot);
    api.use(router);
};