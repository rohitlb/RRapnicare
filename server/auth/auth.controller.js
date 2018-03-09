'use strict';

import User from '../models/user.model';
import * as sms from "../helpers/sms.helper";
import jwt from 'jsonwebtoken';

let TOKEN_SECRET = require('../config/environment').secrets.token_secret;

export function requestOTP(req,res){
  if(req.body.phone.length != 10)
    return res.status(400).json({message: 'Invalid phone number'});

  User.findOne({phone: req.body.phone}).exec()
    .then(user => {
      if(user)
        return res.status(400).json({message: 'The user is already registered'});

      sms.sendOTP(req.body.phone,res, cb_signupOTP);
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

export function create(req, res) {
  var data = req.body;

  if(!data.phone || !data.OTP || !data.OTP_session_id)
    return res.status(400).json({message: 'Missing required information. Please send all fields'});

  sms.verifyOTP(data,res,cb_verifyOTP);
}

export function index(req, res) {
  var data = req.body;

  User.findOne({phone: data.phone}).exec()
    .then(user => {
      if(!user)
        return res.status(400).json({message: 'This phone number is not registered with us'});

      user.authenticate(data.password, function (authError, authenticated) {
        if(authError)
          return res.status(500).json(authError);

        if(!authenticated)
          return res.status(401).json({message: 'Invalid Credentials'});
        else{
          var token = jwt.sign(user.token, TOKEN_SECRET, {expiresIn: 60*60*24*365});
          return res.json({ token });
        }
      });
    })
    .catch(err => {
      res.status(500).json(err);
    });
}


//Internal functions from here

/**
 * Eventually controller must be freed from responsibility of checking OTP response states
 * */

function cb_signupOTP(err,body,res){
  if(err) {
    let error = JSON.parse(err.error);
    return res.status(500).json(error);
  }

  body = JSON.parse(body);

  if(body.Status == "Error")
    return res.status(400).json(body);
  else
    return res.json(body);
}

function cb_verifyOTP(err, body, res) {
  if(err) {
    console.log('inside error');
    let error = JSON.parse(err.error);
    return res.status(500).json(error);
  }

  if(body.Status != 'Success' && body.Details != 'OTP Matched')
    return res.status(400).json({message: body.Details});

  User.create({
    phone: body.phone,
    password: body.password
  })
  .then(newUser => {
    var token = jwt.sign(newUser.token, TOKEN_SECRET, {expiresIn: 60*60*24*365});
    return res.json({ token });
  })
  .then(() => {
    //you may want to send an email here
  })
  .catch(err => {
    res.status(500).json(err);
  });
}
