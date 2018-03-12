'use strict';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import compose from 'composable-middleware';

let TOKEN_SECRET = require('../config/environment').secrets.token_secret;

var validateJwt = expressJwt({
  secret: TOKEN_SECRET
});

/*Attached the user object to the request if authenticated (AUTHENTICATION) ...*/
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function (req,res,next) {
      validateJwt(req,res,next);
    })
    //Attach user to request
    .use(function (req, res, next) {
      User.findById(req.user._id).exec()
        .then(user => {
          if(!user)
            return res.status(401).json({message: 'Un-Authorized'});
          req.user = user;
          next();
          return null;
        })
        .catch(err => next(err));
    });
}

/* Following functions are to authorize role specific functionalities
* and act as a guard (AUTHORIZATION)*/
export function hasRole(roleRequired) {
  if(!roleRequired)
    throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req,res, next){
      if(req.user.role == roleRequired)
        return next();
      else
        return res.status(403).json({message: 'You are not allowed to use this resource'});
    });
}


/* Returns a jwt signed by the app secret*/
export function signToken(id, role) {
  return jwt.sign({ _id: id, role: role}, TOKEN_SECRET, {expiresIn: 60*60*24*365});
}
