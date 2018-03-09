'use strict';

import express from 'express';
import * as controller from './auth.controller';
import * as auth from './auth.service';

var router = express.Router();

router.post('/login',controller.index);
router.post('/signupOTP', controller.requestOTP);
router.post('/signup',controller.create);
router.post('/loginOTP',controller.requestLoginOTP);
router.post('/verifyLoginOTP',controller.verifyLoginOTP);

router.post('/resetPassword',authToken,controller.newPassword);
router.post('/details',authToken, controller.userDetails);

/**
 * We need routes for
 * 1. Login with OTP
 * 2. Reset password
 * 3. Add new user details such as email etc*/


function authToken(req, res,next){
  let bearerHeader = req.headers["token"];
  if(typeof bearerHeader !== 'undefined'){
    let bearer = bearerHeader.split(' ');
    let bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
  else{
    res.status(403).json({message : "token error"});
  }
}

module.exports = router;
