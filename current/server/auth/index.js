'use strict';

import express from 'express';
import * as controller from './auth.controller';
import * as auth from './auth.service';

var router = express.Router();


router.post('/login',controller.index);
router.post('/signupOTP', controller.requestOTP);
router.post('/signup',controller.create);


/**
 * We need routes for
 * 1. Login with OTP
 * 2. Reset password
 * 3. Add new user details such as email etc*/

module.exports = router;
