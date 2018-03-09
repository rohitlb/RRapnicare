'use strict';

import crypto from 'crypto';
import mongoose, {Schema} from 'mongoose';
import bluebird from 'bluebird';
mongoose.Promise = bluebird;

var UserSchema = new Schema({
  role: {type: String, default: 'user'},
  name: {type: String},
  phone: {type: String, required: true},
  password: {type: String, required: true},
  salt: {type: String},
  email: {type: String, lowercase: true},
},{
  timestamp: true
});

//non-sensitive info is used to make tokens
UserSchema.virtual('token').get(function () {
  return {
    _id: this._id,
    role: this.role
  }
});

// validate phone is not taken
UserSchema.path('phone')
  .validate(function (value) {
    return this.constructor.findOne({phone: value}).exec()
      .then(user => {
        if(user){
          if(this.id === user.id)
            return true;
          else
            return false;
        }
        return true;
      })
      .catch(function (err) {
        throw err;
      });
  },'The specified phone number is already in use');

var validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hooks
 */

UserSchema.pre('save',function (next) {
  // handling new/update passwords
  if(!this.isModified('password')){
    return next();
  }
  console.log("reaches");
  if(!validatePresenceOf(this.password)){
    return next(new Error('Invalid Password'));
  }

  //make salt with a callback
  this.makeSalt((saltErr,salt) => {
    if(saltErr){
      return next(saltErr);
    }
    this.salt = salt;
    this.encryptPassword(this.password, (encryptErr,hashedPassword) => {
      if(encryptErr){
        console.log(encryptErr);
        return next(encryptErr);
      }
      this.password = hashedPassword;
      console.log(this.password);
      return next();
    });
  });
});

UserSchema.pre('update',function (next) {
  // handling new/update passwords

  console.log("pre "+this.password);
  var user = this;
  console.log(user);
  var password = user._update.$set.password;
  console.log("pass "+password);
  if(!validatePresenceOf(password)){
    return next(new Error('Invalid Password'));
  }
  //make salt with a callback
  this.makeSalt((saltErr,salt) => {
    if(saltErr){
      return next(saltErr);
    }
    console.log(password);

    this.salt = salt;
    console.log(password);
    this.encryptPassword(password, (encryptErr,hashedPassword) => {
      if(encryptErr){
        console.log(encryptErr);
        return next(encryptErr);
      }
      password = hashedPassword;
      console.log(password);
      return next();
    });
  });
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authentication - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   */

  authenticate(password,callback){
    if(!callback)
      return this.password === this.encryptPassword(password);

    this.encryptPassword(password, (err,pwdGen) => {
      if(err)
        return callback(err);

      console.log(this.password);
      console.log(pwdGen);
      if(this.password === pwdGen)
        return callback(null,true);
      else
        return callback(null,false);
    });
  },

  /**
   * Make Salt
   * @param {Number} [byteSize] - optional salt byte size
   * @param {Function} callback
   */
  makeSalt(...args){
    let byteSize;
    let callback;
    let defaultByteSize = 16;

    if(typeof args[0] === 'function'){
      callback = args[0];
      byteSize = defaultByteSize;
    }else if(typeof args[1] === 'function'){
      callback = args[1];
    }else{
      throw newError('Missing Callback');
    }

    if(!byteSize){
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err,salt)=>{
      if(err){
        return callback(err);
      }else{
        return callback(null,salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   */
  encryptPassword(password,callback){
    if(!password || !this.salt){
      if(!callback){
        return null;
      }else{
        return callback('Missing password or salt');
      }
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt,'base64');

    if(!callback){
      return crypto.pbkdf2Sync(password,salt,defaultIterations,defaultKeyLength,'sha1')
        .toString('base64');
    }

    return crypto.pbkdf2(password,salt,defaultIterations,defaultKeyLength,'sha1', (err,key)=>{
      if(err){
        return callback(err);
      }else{
        return callback(null,key.toString('base64'));
      }
    });
  }
};

export default mongoose.model('User', UserSchema);
