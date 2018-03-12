'use strict';

module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://127.0.0.1:27017/apnicare-dev'
  },

  // Server port
  port: 3000,

  // Server IP
  ip: '0.0.0.0',

  // Secret for session
  secrets: {
    session: 'apnicare-mean-secret',
    token_secret: 'apnicare-token-secret'
  },

  TFactor: {
    api_key: '0c7a7ff4-535a-11e7-94da-0200cd936042'
  }

  // Further configuration will be added soon

};
