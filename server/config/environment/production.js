'use strict';

// Production specific configuration
// =================================

module.exports = {

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI
    || process.env.MONGO_URL
  },

  // Server port
  port: process.env.PORT,

  // Server IP
  ip: process.env.IP,

  // Secret for session
  secrets: {
    session: process.env.SESSION_SECRETS,
    token_secret: process.env.TOKEN_SECRET
  },

  TFactor: {
    api_key: process.env.TFACTOR_API_KEY
  }

  // Further configuration will be added soon

};
