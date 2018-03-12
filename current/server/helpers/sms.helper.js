let API_KEY = require('../config/environment').TFactor.api_key;

import request from 'request-promise';

export function sendOTP(target,res,callback) {
  if(!target)
    return callback(new Error("Phone number is required"));

  request({
    method: "GET",
    uri: `https://2factor.in/API/V1/${API_KEY}/SMS/${target}/AUTOGEN`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  .then((body) => {
    callback(null,body,res);
  })
  .catch((err,body) => {
    callback(err,body,res);
  });
}

export function verifyOTP(payload, res, callback) {
  request({
    method: "GET",
    uri: `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${payload.OTP_session_id}/${payload.OTP}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  .then(body => {
    body = JSON.parse(body);

    Object.assign(body, payload);
    callback(null,body,res);
  })
  .catch(err => {
    callback(err,null,res);
  });
}
